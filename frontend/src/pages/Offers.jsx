import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Offers() {
    const offers = [
        { id: 1, code: "WELCOME50", desc: "Get 50% flat off on your first order", bg: "from-pink-500 to-rose-500" },
        { id: 2, code: "FREEDEL", desc: "Free Delivery on orders above ₹149", bg: "from-violet-500 to-purple-500" },
        { id: 3, code: "PIZZA20", desc: "Flat 20% off on all Pizzas", bg: "from-orange-400 to-amber-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 flex flex-col">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Available Offers</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.map(offer => (
                        <div
                            key={offer.id}
                            className={`bg-gradient-to-br ${offer.bg} p-8 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group`}
                        >
                            {/* Decorative circles */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>

                            <div className="relative z-10">
                                <h1 className="border-2 border-white/50 border-dashed inline-block px-4 py-1 rounded-lg font-mono text-xl font-bold mb-4 tracking-wider">
                                    {offer.code}
                                </h1>
                                <p className="text-lg font-medium opacity-90 mb-6">
                                    {offer.desc}
                                </p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(offer.code);
                                        window.alert(`Copied ${offer.code} to clipboard!`);
                                    }}
                                    className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-transform shadow-md"
                                >
                                    Copy Code
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
