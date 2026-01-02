import React from 'react';

export default function LoadingSpinner({ fullScreen = false }) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-200 dark:border-red-900 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 border-t-4 border-red-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-10">
            <div className="relative">
                <div className="w-10 h-10 border-2 border-red-100 dark:border-red-900/30 rounded-full"></div>
                <div className="absolute inset-0 border-t-2 border-red-500 rounded-full animate-spin"></div>
            </div>
        </div>
    );
}
