import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { restaurants } from '../data/restaurants';
import { useCart } from '../context/CartContext';

export default function RestaurantDetails() {
    const { id } = useParams();
    const { addToCart, cartItems, updateQuantity } = useCart();

    const restaurant = restaurants.find(r => r.id === parseInt(id));

    const [vegOnly, setVegOnly] = useState(false);
    const [sortBy, setSortBy] = useState("default"); // default, high, low

    // Use restaurant specific menu or empty array if not defined
    const menuItems = restaurant?.menu || [];

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
                <div className="text-center">
                    <p className="text-xl mb-4">Restaurant not found.</p>
                    <Link to="/" className="text-red-500 hover:text-red-400 font-bold">Go Home</Link>
                </div>
            </div>
        );
    }

    const getQty = (itemId) => {
        const item = cartItems.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    };

    const getProcessedMenu = () => {
        let items = [...menuItems];

        if (restaurant.isVeg) {
            items = items.filter(i => i.veg);
        }

        if (vegOnly) {
            items = items.filter(i => i.veg);
        }
        if (sortBy === "low") {
            items.sort((a, b) => parseInt(a.price.replace('₹', '')) - parseInt(b.price.replace('₹', '')));
        } else if (sortBy === "high") {
            items.sort((a, b) => parseInt(b.price.replace('₹', '')) - parseInt(a.price.replace('₹', '')));
        }
        return items;
    };

    const processedMenu = getProcessedMenu();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Navbar />

            {/* Header Section */}
            <div className="bg-white dark:bg-[#1e1e1e] py-12 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">{restaurant.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{restaurant.cuisines.join(", ")}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                        <div className="bg-green-600 text-white px-3 py-1 rounded font-bold flex items-center gap-1">
                            <span>★</span> {restaurant.rating}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{restaurant.deliveryTime}</span>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{restaurant.priceForTwo} for two</span>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Menu</h2>

                    <div className="flex items-center gap-4">
                        {/* Veg Only Toggle */}
                        <div
                            onClick={() => setVegOnly(!vegOnly)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer select-none border transition-colors ${vegOnly
                                ? 'bg-green-50/10 border-green-500'
                                : 'bg-white dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-700'
                                }`}
                        >
                            <div className={`w-4 h-4 rounded-full border ${vegOnly ? 'bg-green-600 border-green-600' : 'bg-transparent border-gray-400'}`}></div>
                            <span className={`font-medium ${vegOnly ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>Pure Veg</span>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                        >
                            <option value="default">Sort by</option>
                            <option value="low">Price: Low to High</option>
                            <option value="high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {processedMenu.map(item => {
                        const qty = getQty(item.id);
                        return (
                            <div key={item.id} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between gap-4 group hover:shadow-md transition-shadow">
                                <div className="flex-grow min-w-0">
                                    <div className="mb-2">
                                        {item.veg ? (
                                            <span className="inline-block border border-green-600 rounded p-[2px]">
                                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            </span>
                                        ) : (
                                            <span className="inline-block border border-red-600 rounded p-[2px]">
                                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">{item.price}</p>
                                </div>

                                <div className="relative flex-shrink-0">
                                    <div className="w-32 h-28 rounded-xl overflow-hidden mb-8">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-lg rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[100px]">
                                        {qty > 0 ? (
                                            <div className="flex items-center justify-between px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="text-red-500 font-bold px-2 hover:bg-red-50 rounded"
                                                >
                                                    -
                                                </button>
                                                <span className="text-green-600 font-bold text-sm mx-1">{qty}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="text-green-600 font-bold px-2 hover:bg-green-50 rounded"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-full text-green-600 font-bold text-sm py-2 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors uppercase"
                                            >
                                                ADD
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}
