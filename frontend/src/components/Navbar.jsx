import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function AppNavbar({ user }) {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <nav className={`sticky top-0 z-50 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1e1e1e]/90 text-white border-b border-gray-700' : 'bg-white/90 text-gray-800 border-b border-gray-200'} backdrop-blur-md shadow-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-1 no-underline">
                        <span className="text-2xl font-bold tracking-tight">Food<span className="text-red-500">Run</span></span>
                    </Link>

                    {/* Desktop Search (Optional - keeping simplified for now as per design) */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <input
                            type="search"
                            placeholder="Search for restaurants..."
                            className={`w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${theme === 'dark' ? 'bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                        />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200/20 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {/* Navigation Links */}
                        <div className="hidden sm:flex items-center gap-6 font-medium">
                            <Link to="/" className={`hover:text-red-500 transition-colors ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Home</Link>
                            <Link to="/offers" className={`hover:text-red-500 transition-colors ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Offers</Link>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:text-red-500 transition-colors group">
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
                    </div>
                </div>
            </div>
        </nav>
    );
}
