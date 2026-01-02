import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function AppNavbar({ user }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cartItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            showToast("Logged out successfully");
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
            showToast("Logout failed", "error");
        }
    };

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.trim()) {
            navigate(`/?search=${encodeURIComponent(term)}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="sticky top-0 z-50 transition-colors duration-300 bg-white/90 dark:bg-[#1e1e1e]/90 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-1 no-underline">
                        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Food<span className="text-red-500">Run</span></span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:block flex-1 max-w-md mx-8 relative">
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search for restaurants..."
                            className="w-full px-4 py-2 pr-10 rounded-full border focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-gray-100 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                            onClick={() => {
                                if (searchTerm.trim()) {
                                    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
                                }
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Mobile Search Toggle */}
                        <button
                            className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Navigation Links */}
                        <div className="hidden sm:flex items-center gap-6 font-medium">
                            <Link to="/" className="hover:text-red-500 transition-colors text-gray-700 dark:text-gray-200">Home</Link>
                            <Link to="/favorites" className="hover:text-red-500 transition-colors text-gray-700 dark:text-gray-200">Favorites</Link>
                            <Link to="/offers" className="hover:text-red-500 transition-colors text-gray-700 dark:text-gray-200">Offers</Link>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:text-red-500 transition-colors group text-gray-700 dark:text-gray-200">
                            <span className="text-xl">🛒</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#1e1e1e]">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Auth Section */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/profile"
                                    className="hidden sm:block font-semibold text-red-500 hover:text-red-600 transition-colors"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300">
                                    Login
                                </button>
                            </Link>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {isMobileSearchOpen && (
                <div className="md:hidden px-4 pb-4 animate-fade-in-down">
                    <div className="relative">
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search restaurants..."
                            autoFocus
                            className="w-full px-4 py-2 pr-10 rounded-full border focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-gray-100 dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                            onClick={() => {
                                if (searchTerm.trim()) {
                                    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
                                }
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
