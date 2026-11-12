"use client";

import React, { ReactNode, ReactElement } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
          <div className="card bg-base-200 shadow-xl max-w-md w-full">
            <div className="card-body">
              <h2 className="card-title text-error text-2xl">
                Oops! Something went wrong
              </h2>
              <p className="text-base-content/70 mt-2">
                We encountered an unexpected error. Please try refreshing the
                page.
              </p>
              {this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold text-error">
                    Error Details
                  </summary>
                  <pre className="bg-base-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="card-actions mt-6">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as ReactElement;
  }
}
