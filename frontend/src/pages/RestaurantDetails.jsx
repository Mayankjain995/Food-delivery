import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { restaurants } from '../data/restaurants';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ReviewModal from '../components/ReviewModal';
import CustomizationModal from '../components/CustomizationModal';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Star, IndianRupee, Info, Search, Filter, ShoppingBag } from 'lucide-react';

export default function RestaurantDetails() {
    const { id } = useParams();
    const { addToCart, cartItems, updateQuantity } = useCart();
    const { showToast } = useToast();

    const restaurant = restaurants.find(r => r.id === parseInt(id));

    const [vegOnly, setVegOnly] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItemForCustomization, setSelectedItemForCustomization] = useState(null);

    // Grouping items by a mock category (or real if available)
    const getGroupedMenu = () => {
        let items = restaurant?.menu || [];

        // Filter by veg
        if (vegOnly) items = items.filter(i => i.veg);

        // Filter by search
        if (searchTerm) {
            items = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Sort
        if (sortBy === "low") {
            items.sort((a, b) => {
                const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
                const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
                return pA - pB;
            });
        } else if (sortBy === "high") {
            items.sort((a, b) => {
                const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
                const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
                return pB - pA;
            });
        }

        // Mock categories if not present
        const groups = {};
        items.forEach(item => {
            const cat = item.category || "Recommended";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    };

    const groupedMenu = getGroupedMenu();
    const categories = Object.keys(groupedMenu);

    // Scroll to category
    const scrollToCategory = (catId) => {
        const element = document.getElementById(catId);
        if (element) {
            const offset = 140; // sticky nav height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const [reviews, setReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [avgRating, setAvgRating] = useState(restaurant?.rating || 0);

    const fetchReviewsAndCheckPermission = async () => {
        if (!restaurant) return;
        try {
            const q = query(collection(db, "reviews"), where("restaurantId", "==", restaurant.id));
            const querySnapshot = await getDocs(q);
            const fetchedReviews = querySnapshot.docs.map(doc => doc.data());
            if (fetchedReviews.length > 0) {
                const total = fetchedReviews.reduce((sum, r) => sum + r.rating, 0);
                setAvgRating((total / fetchedReviews.length).toFixed(1));
            }
            fetchedReviews.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setReviews(fetchedReviews);

            if (auth.currentUser) {
                const ordersQ = query(collection(db, "orders"), where("userId", "==", auth.currentUser.uid));
                const ordersSnapshot = await getDocs(ordersQ);
                const hasOrdered = ordersSnapshot.docs.some(doc => {
                    const data = doc.data();
                    return data.items && data.items.some(item => item.restaurantId === restaurant.id);
                });
                setCanReview(hasOrdered);
            }
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        fetchReviewsAndCheckPermission();
    }, [restaurant]);

    if (!restaurant) return <div>Not Found</div>;

    const getQty = (itemId) => {
        const items = cartItems.filter(i => i.id === itemId);
        return items.reduce((sum, i) => sum + i.quantity, 0);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Navbar />

            {/* Premium Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-[#1e1e1e] py-16 border-b border-gray-100 dark:border-gray-800"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-3/4">
                            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter text-gray-900 dark:text-white">{restaurant.name}</h1>
                            <p className="text-xl text-gray-400 font-bold mb-8">{restaurant.cuisines.join(" • ")}</p>

                            <div className="flex flex-wrap items-center gap-8">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Star className="w-5 h-5 fill-red-500 text-red-500" />
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">{avgRating}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{reviews.length}+ Ratings</span>
                                </div>
                                <div className="flex flex-col border-l dark:border-gray-800 pl-8">
                                    <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-white">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span className="text-2xl font-black">{restaurant.deliveryTime}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Delivery Time</span>
                                </div>
                                <div className="flex flex-col border-l dark:border-gray-800 pl-8">
                                    <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-white">
                                        <IndianRupee className="w-5 h-5 text-gray-400" />
                                        <span className="text-2xl font-black">{restaurant.priceForTwo.replace(/[^0-9]/g, '')}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Price for Two</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/4 bg-red-600 rounded-3xl p-8 text-white shadow-2xl shadow-red-500/20">
                            <h4 className="text-xs font-black uppercase tracking-widest mb-2 opacity-80">Current Offer</h4>
                            <p className="text-3xl font-black mb-4 leading-tight">{restaurant.offer || "Special Menu Today"}</p>
                            <div className="text-[10px] font-black px-3 py-1 bg-white/20 rounded-full inline-block backdrop-blur-sm">USE CODE: WELCOME50</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Sticky Navigation & Menu */}
            <div className="sticky top-[80px] z-[50] bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => scrollToCategory(cat)}
                                className="whitespace-nowrap text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors py-2 px-1 border-b-2 border-transparent hover:border-red-500"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center bg-gray-50 dark:bg-black/20 rounded-2xl px-4 py-2 border border-transparent focus-within:border-red-500/50 transition-all">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search in menu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs font-bold ml-2 w-40 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={() => setVegOnly(!vegOnly)}
                            className={`p-2 rounded-2xl border transition-all ${vegOnly ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-50 dark:bg-black/20 text-gray-400'}`}
                        >
                            🥗
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
                {categories.map(cat => (
                    <div key={cat} id={cat} className="mb-16 scroll-mt-[160px]">
                        <h2 className="text-3xl font-black mb-8 flex items-center gap-4 text-gray-900 dark:text-white">
                            {cat}
                            <span className="h-1 flex-grow bg-gray-100 dark:bg-gray-800 rounded-full"></span>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{groupedMenu[cat].length} Items</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {groupedMenu[cat].map(item => {
                                const qty = getQty(item.id);
                                return (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-gray-800 flex items-center gap-6 group hover:shadow-2xl hover:shadow-red-500/5 transition-all text-gray-900 dark:text-white"
                                    >
                                        <div className="relative w-32 h-32 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                                                {item.veg && (
                                                    <div className="w-5 h-5 bg-white rounded flex items-center justify-center p-0.5 shadow-md">
                                                        <div className="w-full h-full border-2 border-green-600 rounded-sm flex items-center justify-center">
                                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                )}
                                                {item.jain && (
                                                    <div className="w-5 h-5 bg-white rounded flex items-center justify-center p-0.5 shadow-md group/jain relative">
                                                        <span className="text-[10px] leading-none">🕉️</span>
                                                        <div className="absolute bottom-full right-0 mb-2 invisible group-hover/jain:visible bg-black text-white text-[8px] px-2 py-1 rounded whitespace-nowrap z-10">Jain Available</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-black tracking-tight">{item.name}</h3>
                                                {item.customizable && <span className="text-[8px] font-black bg-orange-100 text-orange-600 px-1 py-0.5 rounded tracking-widest flex items-center gap-0.5"><ShoppingBag size={8} />CUSTOM</span>}
                                            </div>
                                            <p className="text-red-500 font-extrabold mb-2">{item.price}</p>
                                            <p className="text-gray-400 text-xs font-medium line-clamp-2 mb-4">{item.description || "Freshly prepared with authentic ingredients."}</p>

                                            <div className="flex items-center gap-4">
                                                {qty > 0 && !item.customizable ? (
                                                    <div className="flex items-center bg-gray-100 dark:bg-[#2a2a2a] rounded-xl px-2">
                                                        <button onClick={() => updateQuantity(item.id, [], -1)} className="p-2 text-red-500 font-black text-lg hover:scale-125 transition-transform">-</button>
                                                        <span className="font-black text-sm px-4">{qty}</span>
                                                        <button onClick={() => updateQuantity(item.id, [], 1)} className="p-2 text-green-600 font-black text-lg hover:scale-125 transition-transform">+</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => item.customizable ? setSelectedItemForCustomization(item) : addToCart({ ...item, restaurantId: restaurant.id })}
                                                        className="bg-white dark:bg-[#2a2a2a] border-2 border-gray-100 dark:border-gray-800 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all shadow-sm active:scale-95"
                                                    >
                                                        {item.customizable ? (qty > 0 ? "Add More" : "Add & Customize") : "Add to Cart"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Reviews Section */}
                <section className="mt-24 pt-24 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-black mb-2 text-gray-900 dark:text-white">Customer Stories</h2>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">{reviews.length} Validated Reviews</p>
                        </div>
                        {canReview && (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="bg-black dark:bg-white text-white dark:text-black font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest border border-black dark:border-white transition-all hover:bg-gray-800 dark:hover:bg-gray-100"
                            >
                                Share your story
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.length === 0 ? (
                            <div className="col-span-3 text-center py-20 bg-gray-50 dark:bg-black/20 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <span className="text-4xl block mb-4">✍️</span>
                                <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No reviews yet. Be the first!</p>
                            </div>
                        ) : (
                            reviews.map((r, i) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    key={i}
                                    className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm"
                                >
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, star) => (
                                            <Star key={star} size={14} className={star < r.rating ? "fill-red-500 text-red-500" : "text-gray-200 dark:text-gray-700"} />
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed mb-6 text-gray-700 dark:text-gray-300">"{r.comment}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-black/40 rounded-full flex items-center justify-center font-black text-xs text-gray-900 dark:text-white">{r.userName?.[0].toUpperCase() || "U"}</div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{r.userName || 'Anonymous User'}</p>
                                            <p className="text-[8px] text-gray-400 font-bold">{r.createdAt?.seconds ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <AnimatePresence>
                {showReviewModal && (
                    <ReviewModal
                        restaurantId={restaurant.id}
                        onClose={() => setShowReviewModal(false)}
                        onReviewAdded={() => {
                            fetchReviewsAndCheckPermission();
                            showToast("Review posted successfully!", "success");
                        }}
                    />
                )}
                {selectedItemForCustomization && (
                    <CustomizationModal
                        item={selectedItemForCustomization}
                        onClose={() => setSelectedItemForCustomization(null)}
                        onAdd={(item, options, instructions) => {
                            addToCart({ ...item, restaurantId: restaurant.id }, options, instructions);
                            showToast(`${item.name} customized and added!`, 'success');
                        }}
                    />
                )}
            </AnimatePresence>
            <Footer />
        </div>
    );
}
