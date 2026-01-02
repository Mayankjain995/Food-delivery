import React from 'react';

export default function HeroSection() {
    return (
        <div className="relative overflow-hidden rounded-3xl mb-12 p-8 md:p-12 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] shadow-2xl">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
                {/* Text Content */}
                <div className="md:w-7/12 text-center md:text-left z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
                        Hungry?
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-light text-gray-400 mb-6">
                        Order from top restaurants near you.
                    </h2>
                    <div className="inline-block bg-red-500/10 text-red-500 font-bold px-6 py-3 rounded-xl mb-8 border border-red-500/20">
                        Get 50% OFF on your first order!
                    </div>
                    <div>
                        <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            Order Now
                        </button>
                    </div>
                </div>

                {/* Image Content */}
                <div className="md:w-5/12 text-center z-10 relative">
                    <div className="relative inline-block group">
                        {/* Glow effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/10 blur-3xl rounded-full"></div>

                        <img
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                            alt="Delicious Food"
                            className="relative w-full max-w-[300px] md:max-w-[350px] aspect-square object-cover rounded-full shadow-2xl border-8 border-white/5 rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
