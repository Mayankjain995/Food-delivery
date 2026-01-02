import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { restaurants } from '../data/restaurants'; // Fallback / Source of Truth for static data

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!auth.currentUser) return;
            try {
                const q = query(collection(db, "users", auth.currentUser.uid, "favorites"));
                const querySnapshot = await getDocs(q);

                // We stored { restaurantId, name, image, addedAt } in Firestore
                // But we might want the FULL data from restaurants.js to render the card properly (cuisines, rating, etc.)
                // So we'll map the IDs back to the static data

                const favIds = querySnapshot.docs.map(doc => parseInt(doc.id)); // doc.id is restaurantId string
                const favRestaurants = restaurants.filter(r => favIds.includes(r.id));

                setFavorites(favRestaurants);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 flex flex-col">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-12 w-full flex-grow">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Favorites</h1>

                {loading ? (
                    <LoadingSpinner />
                ) : favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-[#1e1e1e] rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                        <div className="text-6xl mb-4">❤️</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Heart items you like to save them here for easier ordering.</p>
                        <a href="/" className="bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition-colors">
                            Find Restaurants
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favorites.map(restaurant => (
                            <RestaurantCard key={restaurant.id} data={restaurant} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
