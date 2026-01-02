import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import RestaurantCard from '../components/RestaurantCard';
import { restaurants, foodCategories } from '../data/restaurants';

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getFilteredRestaurants = () => {
        let sorted = [...restaurants];

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase().replace(/\s+/g, ''); // Remove spaces for looser matching (e.g. icecream -> icecream)

            sorted = sorted.filter(r => {
                const nameMatch = r.name.toLowerCase().replace(/\s+/g, '').includes(query);
                const cuisineMatch = r.cuisines.some(c => c.toLowerCase().replace(/\s+/g, '').includes(query));

                // Also check if any menu item matches the search query
                const menuMatch = r.menu?.some(item => item.name.toLowerCase().replace(/\s+/g, '').includes(query));

                return nameMatch || cuisineMatch || menuMatch;
            });
        }

        if (filter === "Rating") {
            sorted = sorted.filter(r => r.rating >= 4.0);
        } else if (filter === "Fast") {
            sorted = sorted.filter(r => parseInt(r.deliveryTime) <= 30);
        } else if (filter === "Veg") {
            sorted = sorted.filter(r => r.isVeg);
        }

        if (selectedCategory) {
            sorted = sorted.filter(r => r.cuisines.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase())));
        }

        return sorted;
    };

    const filteredRestaurants = getFilteredRestaurants();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
                <div className="animate-pulse text-xl">Loading...</div>
            </div>
        );
    }

    const handleCategoryClick = (catName) => {
        if (selectedCategory === catName) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(catName);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
                <HeroSection />

                {/* Food Categories Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Inspiration for your first order</h2>
                    <div className="flex overflow-x-auto gap-6 py-4 px-2 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {foodCategories.map((cat) => (
                            <div
                                key={cat.id}
                                className={`flex-shrink-0 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 ${selectedCategory === cat.name ? 'scale-105' : ''}`}
                                onClick={() => handleCategoryClick(cat.name)}
                            >
                                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md mb-3 border-4 ${selectedCategory === cat.name ? 'border-red-500' : 'border-transparent'}`}>
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className={`text-sm sm:text-base font-semibold ${selectedCategory === cat.name ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Restaurants Section */}
                <section className="mb-16" id="restaurants">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top restaurants in your city</h2>

                        <div className="flex flex-wrap gap-2">
                            {["All", "Rating", "Fast", "Veg"].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(filter === type ? "All" : type)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${filter === type
                                        ? 'bg-gray-800 text-white border-gray-800 dark:bg-white dark:text-black dark:border-white'
                                        : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 hover:shadow-2x1 transition:shadow-2x1">
                            {filteredRestaurants.map(restaurant => (
                                <RestaurantCard key={restaurant.id} data={restaurant} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-xl">
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No restaurants found matching your filters</p>
                            <button
                                className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                    setFilter("All");
                                    setSelectedCategory(null);
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    );
}