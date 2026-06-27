"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Card, CardContent } from "@/components/atoms/Card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const supabase = createClient();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Successfully signed in!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error("Google sign-in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Logo / Branding */}
        <div className="flex items-center justify-center gap-2">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" className="text-brand-primary">
            <path d="M8 14 C8 14 4 10 4 7 C4 4.8 5.8 3 8 3 C10.2 3 12 4.8 12 7 C12 10 8 14 8 14Z" fill="currentColor" opacity="0.9" />
            <path d="M8 3 C8 3 4 2 2 5 C1 7 3 9.5 6 10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
            <path d="M8 3 C8 3 12 2 14 5 C15 7 13 9.5 10 10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
          </svg>
          <span className="font-body font-bold text-xl tracking-tight text-text-primary">YAADEIN</span>
        </div>

        <Card className="border border-border bg-surface-primary shadow-card">
          <CardContent className="p-8 flex flex-col gap-6">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-text-primary">Welcome back</h2>
              <p className="text-sm text-text-secondary mt-1.5">Sign in to manage your events</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                name="email"
                control={control}
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                disabled={isLoading}
              />

              <div className="flex flex-col gap-1">
                <FormField
                  name="password"
                  control={control}
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-text-muted hover:text-brand-primary transition-colors mt-1"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                variant="primary"
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
                className="mt-2"
              >
                Sign in
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-x-0 h-px bg-border" />
              <span className="relative px-3 bg-surface-primary text-xs font-semibold text-text-muted uppercase tracking-wider">
                or
              </span>
            </div>

            <Button
              variant="secondary"
              fullWidth
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              leftIcon={
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              }
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-brand-primary hover:underline">
            Sign up &rarr;
          </Link>
        </p>
      </div>
    </main>
  );
}
