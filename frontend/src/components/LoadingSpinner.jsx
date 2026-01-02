import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullScreen = false }) {
    const content = (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-16 h-16 border-4 border-gray-100 dark:border-gray-800 rounded-full border-t-red-600"
                ></motion.div>

                {/* Inner Pulsing Pulse */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-2 bg-red-600/10 rounded-full"
                ></motion.div>

                {/* Center Dot */}
                <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full shadow-lg shadow-red-500/50"
                ></motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Food</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Run</span>
            </motion.div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#121212] transition-colors duration-300">
                {content}
            </div>
        );
    }

    return content;
}
