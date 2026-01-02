import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Heart, Moon, Sun, LogOut, Menu, X, ArrowUpRight } from 'lucide-react';
import { restaurants } from '../data/restaurants';

export default function Navbar({ user: propUser }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cartItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [user, setUser] = useState(propUser || null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => {
            unsubscribe();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            showToast("Logged out successfully");
            navigate('/login');
        } catch (error) {
            showToast("Logout failed", "error");
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (search.trim()) {
            navigate(`/?search=${encodeURIComponent(search)}`);
        } else {
            navigate('/');
        }
    };

    const filteredSuggestions = restaurants.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisines.some(c => c.toLowerCase().includes(search.toLowerCase()))
    ).slice(0, 5);

    return (
        <nav className={`sticky top-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5' : 'py-6 bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">

                {/* Logo */}
                <Link to="/" className="flex-shrink-0 group">
                    <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white flex items-center gap-1">
                        FOOD<span className="text-red-500 group-hover:rotate-12 transition-transform">RUN</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </span>
                </Link>

                {/* Advanced Search & Suggestions */}
                <div className="hidden md:block flex-grow max-w-xl relative">
                    <form onSubmit={handleSearchSubmit} className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Find your favorite taste..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
                                onFocus={() => setShowSuggestions(true)}
                                className="w-full bg-gray-50/50 dark:bg-black/20 border-2 border-transparent focus:border-red-500/10 focus:bg-white dark:focus:bg-[#1e1e1e] rounded-3xl py-3 pl-14 pr-16 text-sm font-bold shadow-sm focus:shadow-2xl focus:shadow-red-500/5 transition-all outline-none dark:text-white"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 p-2 bg-red-500 text-white rounded-[1.25rem] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    <AnimatePresence>
                        {showSuggestions && search.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-[#1e1e1e] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 overflow-hidden z-[100]"
                            >
                                <div className="p-4">
                                    <div className="px-4 py-2 mb-2 flex justify-between items-center">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Suggestions</p>
                                        <X size={14} className="text-gray-300 cursor-pointer hover:text-red-500" onClick={() => setShowSuggestions(false)} />
                                    </div>

                                    {filteredSuggestions.length > 0 ? (
                                        filteredSuggestions.map(r => (
                                            <div
                                                key={r.id}
                                                onClick={() => { navigate(`/restaurant/${r.id}`); setShowSuggestions(false); setSearch(""); }}
                                                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-black/20 rounded-2xl cursor-pointer transition-all group"
                                            >
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                                                    <img src={r.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{r.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 line-clamp-1">{r.cuisines.join(", ")}</p>
                                                </div>
                                                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400">
                                            <p className="text-xs font-black uppercase tracking-widest">No matching results</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 sm:gap-5">

                    <button
                        onClick={toggleTheme}
                        className="p-3 bg-gray-50 dark:bg-black/20 rounded-2xl text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:shadow-xl transition-all"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="/favorites" className="hidden sm:flex p-3 bg-gray-50 dark:bg-black/20 rounded-2xl text-gray-500 dark:text-gray-400 hover:text-red-500 hover:shadow-xl transition-all">
                        <Heart size={20} />
                    </Link>

                    <Link to="/cart" className="relative p-3 bg-gray-50 dark:bg-black/20 rounded-2xl text-gray-500 dark:text-gray-400 hover:text-emerald-500 hover:shadow-xl transition-all group">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#121212] shadow-lg group-hover:scale-110 transition-transform">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-2 hidden sm:block"></div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:shadow-red-500/20 transition-all overflow-hidden">
                                    <User size={18} />
                                </div>
                                <span className="hidden lg:block text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">
                                    {user.displayName?.split(' ')[0] || 'Profile'}
                                </span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-3 bg-gray-50 dark:bg-black/20 rounded-2xl text-gray-400 hover:text-red-500 transition-all"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all active:scale-95">
                                Login
                            </button>
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
}
