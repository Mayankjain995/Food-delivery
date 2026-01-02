import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong.</h1>
                    <p className="text-gray-600 mb-6">We're sorry, but the application encountered an unexpected error.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
                    >
                        Refresh Page
                    </button>

                    {/* Only show technical details in development or if needed */}
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-8 text-left bg-gray-200 p-4 rounded max-w-lg overflow-auto text-xs font-mono">
                            <summary className="mb-2 font-bold cursor-pointer">Error Details</summary>
                            {this.state.error && this.state.error.toString()}
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
