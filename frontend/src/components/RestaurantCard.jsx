import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, IndianRupee, Heart } from 'lucide-react';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, deleteDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function RestaurantCard({ data }) {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isFavorite, setIsFavorite] = useState(false);
    const [dynamicRating, setDynamicRating] = useState(data.rating);
    const [reviewCount, setReviewCount] = useState(0);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        // Fetch dynamic reviews for this restaurant
        const fetchStats = async () => {
            try {
                const q = query(collection(db, "reviews"), where("restaurantId", "==", parseInt(data.id)));
                const querySnapshot = await getDocs(q);
                const reviews = querySnapshot.docs.map(doc => doc.data());

                if (reviews.length > 0) {
                    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
                    setDynamicRating((total / reviews.length).toFixed(1));
                    setReviewCount(reviews.length);
                } else {
                    setDynamicRating(data.rating); // Fallback to static
                    setReviewCount(0);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, [data.id, data.rating]);
    useEffect(() => {
        if (!userId) return;
        const unsub = onSnapshot(doc(db, "users", userId, "favorites", data.id.toString()), (doc) => {
            setIsFavorite(doc.exists());
        });
        return () => unsub();
    }, [userId, data.id]);

    const toggleFavorite = async (e) => {
        e.stopPropagation();
        if (!userId) {
            showToast("Please login to save favorites", "error");
            return;
        }
        const ref = doc(db, "users", userId, "favorites", data.id.toString());
        if (isFavorite) {
            await deleteDoc(ref);
            showToast("Removed from favorites", "success");
        } else {
            await setDoc(ref, {
                restaurantId: data.id,
                name: data.name,
                image: data.image,
                cuisines: data.cuisines,
                rating: data.rating,
                deliveryTime: data.deliveryTime,
                priceForTwo: data.priceForTwo,
                addedAt: new Date().toISOString()
            });
            showToast("Added to favorites!", "success");
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            className="group relative bg-white dark:bg-[#1e1e1e] rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 border border-gray-100 dark:border-gray-800 cursor-pointer"
            onClick={() => navigate(`/restaurant/${data.id}`)}
        >
            <div className="relative h-52 sm:h-56 overflow-hidden">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {data.offer && (
                        <div className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg w-fit">
                            {data.offer}
                        </div>
                    )}
                    {data.isJainAvailable && (
                        <div className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 w-fit">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                            Jain Available
                        </div>
                    )}
                </div>

                <button
                    className={`absolute top-4 right-4 p-3 backdrop-blur-md rounded-2xl transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white hover:text-red-500'}`}
                    onClick={toggleFavorite}
                >
                    <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="w-full bg-white text-black font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                        View Menu
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight line-clamp-1">{data.name}</h3>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-black">
                            <Star size={10} fill="currentColor" /> {dynamicRating}
                        </div>
                        {reviewCount > 0 && (
                            <span className="text-[8px] font-black text-gray-400 mt-1 uppercase tracking-tighter">
                                {reviewCount} Reviews
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-gray-400 text-xs font-bold mb-4 line-clamp-1">{data.cuisines.join(", ")}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{data.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                        <span className="text-gray-400 font-bold">₹</span>
                        <span className="text-sm font-black tracking-tighter">{data.priceForTwo.replace(/[^0-9]/g, '')}</span>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">For Two</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
