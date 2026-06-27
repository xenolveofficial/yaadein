import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/env';

export class ApiError extends Error {
  constructor(public message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function getAuthHeader(): Promise<HeadersInit> {
  // Use createBrowserClient to safely access session in browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
}

async function fetchApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...init } = options;
  
  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;
  let url = new URL(`${baseUrl}${path}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const authHeader = await getAuthHeader();
  
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...authHeader,
    ...headers,
  };

  try {
    const response = await fetch(url.toString(), {
      ...init,
      headers: finalHeaders,
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError('Unauthorized', 401);
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      throw new ApiError(
        errorData?.message || response.statusText || 'API request failed',
        response.status,
        errorData
      );
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => fetchApi<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, data?: unknown, options?: RequestOptions) => 
    fetchApi<T>(path, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data?: unknown, options?: RequestOptions) => 
    fetchApi<T>(path, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(path: string, data?: unknown, options?: RequestOptions) => 
    fetchApi<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string, options?: RequestOptions) => fetchApi<T>(path, { ...options, method: 'DELETE' }),
};
