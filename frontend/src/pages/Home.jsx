import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { restaurants, foodCategories } from '../data/restaurants';
import { SlidersHorizontal, ChevronDown, Filter, Star, Clock, IndianRupee } from 'lucide-react';

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchParams] = useSearchParams();
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
    const searchQuery = searchParams.get('search') || '';

    // Advanced Filters State
    const [priceFilter, setPriceFilter] = useState("all"); // low, mid, high, all
    const [sortBy, setSortBy] = useState("default"); // rating, time, price, popularity

    // UI Local State for Dropdowns
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getFilteredRestaurants = () => {
        let sorted = [...restaurants];

        // 1. Search Filter (using debounced value)
        if (debouncedSearch) {
            const query = debouncedSearch.toLowerCase().replace(/\s+/g, '');

            sorted = sorted.filter(r => {
                const nameMatch = r.name.toLowerCase().replace(/\s+/g, '').includes(query);
                const cuisineMatch = r.cuisines.some(c => c.toLowerCase().replace(/\s+/g, '').includes(query));
                const menuMatch = r.menu?.some(item => item.name.toLowerCase().replace(/\s+/g, '').includes(query));
                return nameMatch || cuisineMatch || menuMatch;
            });
        }

        // 2. Quick Filters
        if (filter === "Rating") {
            sorted = sorted.filter(r => r.rating >= 4.5);
        } else if (filter === "Fast") {
            sorted = sorted.filter(r => parseInt(r.deliveryTime) <= 25);
        } else if (filter === "Jain") {
            sorted = sorted.filter(r => r.isJainAvailable || r.cuisines.includes("Jain"));
        }

        // 3. Category Filter
        if (selectedCategory) {
            sorted = sorted.filter(r =>
                r.cuisines.some(c =>
                    c.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                    selectedCategory.toLowerCase().includes(c.toLowerCase())
                ) ||
                r.name.toLowerCase().includes(selectedCategory.toLowerCase())
            );
        }

        // 4. Price Filter
        if (priceFilter !== "all") {
            sorted = sorted.filter(r => {
                const price = parseInt(r.priceForTwo.replace(/[^0-9]/g, ''));
                if (priceFilter === "low") return price <= 300;
                if (priceFilter === "mid") return price > 300 && price <= 600;
                if (priceFilter === "high") return price > 600;
                return true;
            });
        }

        // 5. Sorting
        if (sortBy === "rating") {
            sorted.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "time") {
            sorted.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        } else if (sortBy === "price") {
            sorted.sort((a, b) => parseInt(a.priceForTwo.replace(/[^0-9]/g, '')) - parseInt(b.priceForTwo.replace(/[^0-9]/g, '')));
        } else if (sortBy === "popularity") {
            sorted.sort((a, b) => (b.promoted ? 1 : 0) - (a.promoted ? 1 : 0));
        }

        return sorted;
    };

    const filteredRestaurants = getFilteredRestaurants();

    if (loading) {
        return <LoadingSpinner fullScreen={true} />;
    }

    const handleCategoryClick = (catName) => {
        if (selectedCategory === catName) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(catName);
        }
    };

    const sortOptions = [
        { id: 'default', label: 'Recommended', icon: <SlidersHorizontal size={14} /> },
        { id: 'rating', label: 'High to Low', icon: <Star size={14} /> },
        { id: 'time', label: 'Fastest Delivery', icon: <Clock size={14} /> },
        { id: 'price', label: 'Budget First', icon: <IndianRupee size={14} /> },
    ];

    const priceOptions = [
        { id: 'all', label: 'Any Price' },
        { id: 'low', label: 'Under ₹300' },
        { id: 'mid', label: '₹300 - ₹600' },
        { id: 'high', label: 'Luxury Selection' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
                <HeroSection />

                <section className="mb-12">
                    <h2 className="text-3xl font-black mb-10 flex items-center gap-4 text-gray-900 dark:text-white">
                        Inspiration for your first order
                        <span className="h-0.5 flex-grow bg-gray-100 dark:bg-gray-800 rounded-full"></span>
                    </h2>
                    <div className="flex overflow-x-auto gap-8 py-4 px-2 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {foodCategories.map((cat) => (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={cat.id}
                                className={`flex-shrink-0 flex flex-col items-center cursor-pointer group`}
                                onClick={() => handleCategoryClick(cat.name)}
                            >
                                <div className={`w-28 h-28 rounded-full shadow-2xl overflow-hidden mb-4 border-4 transition-all duration-300 ${selectedCategory === cat.name ? 'border-red-500 scale-110' : 'border-white dark:border-gray-800 group-hover:border-red-200'}`}>
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:rotate-6" />
                                </div>
                                <span className={`text-sm font-black uppercase tracking-widest ${selectedCategory === cat.name ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'} group-hover:text-red-500 transition-colors`}>
                                    {cat.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Restaurants Section */}
                <section className="mb-16" id="restaurants">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Top restaurants in your city</h2>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Sort Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => { setIsSortOpen(!isSortOpen); setIsPriceOpen(false); }}
                                    className={`flex items-center gap-2 bg-transparent dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 text-sm font-medium transition-all ${isSortOpen ? 'border-red-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    <span className="text-gray-700 dark:text-gray-300">Rating: {sortOptions.find(o => o.id === sortBy)?.label || 'High to Low'}</span>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                                </button>
                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 z-[60]"
                                        >
                                            {sortOptions.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => { setSortBy(opt.id); setIsSortOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 rounded-xl text-sm ${sortBy === opt.id ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-black/20'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Price Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => { setIsPriceOpen(!isPriceOpen); setIsSortOpen(false); }}
                                    className={`flex items-center gap-2 bg-transparent dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 text-sm font-medium transition-all ${isPriceOpen ? 'border-red-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    <span className="text-gray-700 dark:text-gray-300">{priceOptions.find(o => o.id === priceFilter)?.label || 'Cost'}</span>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isPriceOpen ? "rotate-180" : ""}`} />
                                </button>
                                <AnimatePresence>
                                    {isPriceOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 z-[60]"
                                        >
                                            {priceOptions.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => { setPriceFilter(opt.id); setIsPriceOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 rounded-xl text-sm ${priceFilter === opt.id ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-black/20'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Quick Filters */}
                            {["Rating", "Fast", "Jain"].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(filter === type ? "All" : type)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${filter === type
                                        ? 'bg-red-500 border-red-500 text-white'
                                        : 'bg-transparent dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {type === "Rating" ? "Top Rated" : type === "Fast" ? "Fast Delivery" : "Pure Veg"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredRestaurants.map(restaurant => (
                                <RestaurantCard key={restaurant.id} data={restaurant} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-32 bg-white dark:bg-[#1e1e1e] rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className="w-24 h-24 bg-gray-50 dark:bg-black/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border dark:border-gray-800">
                                <Filter size={40} className="text-gray-300 dark:text-gray-700" />
                            </div>
                            <h3 className="text-3xl font-black mb-2 tracking-tight">No Results Found</h3>
                            <p className="text-gray-400 font-bold text-sm mb-10 max-w-md mx-auto leading-relaxed uppercase tracking-widest">We couldn't find any restaurants matching your specific filters and search criteria.</p>
                            <button
                                className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95"
                                onClick={() => {
                                    setFilter("All");
                                    setSelectedCategory(null);
                                    setPriceFilter("all");
                                    setSortBy("default");
                                    // Also clear search params if necessary
                                }}
                            >
                                Reset All Filters
                            </button>
                        </motion.div>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    );
}