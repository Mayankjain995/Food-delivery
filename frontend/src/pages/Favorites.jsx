import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { restaurants } from '../data/restaurants';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!auth.currentUser) {
                setLoading(false);
                return;
            }
            try {
                const q = query(collection(db, "users", auth.currentUser.uid, "favorites"));
                const querySnapshot = await getDocs(q);
                const favIds = querySnapshot.docs.map(doc => parseInt(doc.id));
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
        <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300 flex flex-col">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20 w-full flex-grow">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Your Favorites</h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Curated collection of your local loves</p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <LoadingSpinner />
                    </div>
                ) : favorites.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32 bg-white dark:bg-[#1e1e1e] rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-gray-50 dark:bg-black/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border dark:border-gray-800">
                            <Heart className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Your love list is empty</h2>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10 max-w-sm mx-auto leading-relaxed">Seems like you haven't found your soul-food yet. Explore our top restaurants!</p>
                        <Link to="/" className="inline-block bg-red-600 text-white font-black px-12 py-5 rounded-[2rem] text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all">
                            Browse Restaurants
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
                    >
                        <AnimatePresence>
                            {favorites.map(restaurant => (
                                <RestaurantCard key={restaurant.id} data={restaurant} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            <Footer />
        </div>
    );
}
