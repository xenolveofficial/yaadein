"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/atoms/Button"

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production use a logger service, never console.log
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary]", error, info)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 p-8 text-center"
        >
          <div className="h-12 w-12 rounded-full bg-error-subtle flex items-center justify-center">
            <RefreshCw className="h-5 w-5 text-error" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-text-primary">Something went wrong</p>
            <p className="text-sm text-text-secondary">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
          </div>
          <Button variant="secondary" onClick={this.handleRetry} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
