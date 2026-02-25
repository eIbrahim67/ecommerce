import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
                    <div className="bg-red-50 text-red-600 p-4 rounded-full mb-6 relative">
                        <AlertTriangle className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold font-heading mb-4 text-heading">Oops! Something went wrong.</h1>
                    <p className="text-text-body max-w-md mb-8">
                        We're sorry, but an unexpected error occurred. Please try refreshing the page or navigating back home.
                    </p>

                    <div className="p-4 bg-surface-light rounded-lg border border-border w-full max-w-2xl text-left overflow-auto mb-8 mx-auto hidden sm:block">
                        <p className="font-mono text-sm text-red-500 font-bold mb-2">Error Details (Dev Only):</p>
                        <pre className="text-xs text-text-body whitespace-pre-wrap">{this.state.error?.message}</pre>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={this.handleReset}
                            className="bg-surface-light text-heading border border-border px-6 py-2.5 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
