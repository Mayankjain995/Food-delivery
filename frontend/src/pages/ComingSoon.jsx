import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ComingSoon() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                    Coming Soon
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
                    We're working hard to bring you this page. Stay tuned for something amazing!
                </p>
                <Link
                    to="/"
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-full transition-all"
                >
                    Go Home
                </Link>
            </div>
            <Footer />
        </div>
    );
}
