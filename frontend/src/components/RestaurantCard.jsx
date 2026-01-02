import React from 'react';
import { Link } from 'react-router-dom';

export default function RestaurantCard({ data }) {
    return (
        <div className="h-full bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col">
            <div className="relative">
                <Link to={`/restaurant/${data.id}`} className="block overflow-hidden">
                    <img
                        src={data.image}
                        alt={data.name}
                        className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"; }}
                    />
                </Link>

                {data.promoted && (
                    <div className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur-sm text-gray-200 text-xs uppercase font-bold px-2 py-1 rounded shadow-sm">
                        Promoted
                    </div>
                )}

                {data.offer && (
                    <div className="absolute bottom-4 left-0 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-r shadow-md">
                        {data.offer}
                    </div>
                )}

                <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/70 backdrop-blur-md text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {data.deliveryTime}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate flex-1 pr-2">
                        {data.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        <span>★</span> {data.rating}
                    </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm truncate mb-4">
                    {data.cuisines.join(", ")}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {data.priceForTwo} for two
                    </span>
                    <Link to={`/restaurant/${data.id}`}>
                        <button className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200">
                            View Menu
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
