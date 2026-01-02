import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Ghost } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Navbar />

            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-[120px] -z-10"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-12"
                >
                    <div className="text-[180px] font-black text-gray-900/5 dark:text-white/5 leading-none select-none tracking-tighter">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{
                                y: [-10, 10, -10],
                                rotate: [-5, 5, -5]
                            }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="bg-white dark:bg-[#1e1e1e] p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800"
                        >
                            <Ghost size={120} className="text-red-500" />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-md mx-auto"
                >
                    <h2 className="text-5xl font-black mb-4 tracking-tighter text-gray-900 dark:text-white">Lost in Trans-fat?</h2>
                    <p className="text-gray-400 font-bold text-sm mb-12 leading-relaxed uppercase tracking-[0.2em]">The page you're looking for was either eaten by our delivery boy or never existed.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/">
                            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95 group">
                                <Home size={18} className="group-hover:-translate-y-1 transition-transform" />
                                Back to Kitchen
                            </button>
                        </Link>
                        <Link to="/">
                            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-black/20 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:border-red-500 transition-all active:scale-95 group">
                                <Search size={18} className="group-hover:scale-110 transition-transform" />
                                Find Food
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
