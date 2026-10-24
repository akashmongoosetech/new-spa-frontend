import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Last-resort UI boundary so a render error never leaves the guest with a
 * blank page (especially inside the lazy-loaded admin console).
 */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Keep the detail in the console for support; never render a stack trace.
    console.error('[ui] Unhandled render error:', error, info);
  }

  private reload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-16 text-[#1A1A1A]">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Something went wrong</span>
            <h1 className="mt-2 font-serif text-2xl font-bold text-gray-900">The page could not be displayed</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              A temporary error interrupted this screen. Reloading usually fixes it. If it keeps happening, please
              contact the Tripod Wellness team.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={this.reload}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-brand-950 shadow-sm transition-colors hover:bg-brand-400"
              >
                <RefreshCw className="h-4 w-4" /> Reload page
              </button>
              <a
                href="/"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Home className="h-4 w-4" /> Go home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
