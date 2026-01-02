import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { restaurants } from '../data/restaurants';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import ReviewModal from '../components/ReviewModal';
import { useToast } from '../context/ToastContext';

export default function RestaurantDetails() {
    const { id } = useParams();
    const { addToCart, cartItems, updateQuantity } = useCart();
    const { showToast } = useToast();

    const restaurant = restaurants.find(r => r.id === parseInt(id));

    const [vegOnly, setVegOnly] = useState(false);
    const [sortBy, setSortBy] = useState("default"); // default, high, low

    // Review System State
    const [reviews, setReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [avgRating, setAvgRating] = useState(restaurant?.rating || 0);

    const fetchReviewsAndCheckPermission = async () => {
        if (!restaurant) return;

        try {
            // 1. Fetch Reviews
            const q = query(
                collection(db, "reviews"),
                where("restaurantId", "==", restaurant.id)
            );
            const querySnapshot = await getDocs(q);
            const fetchedReviews = querySnapshot.docs.map(doc => doc.data());

            // Calculate Average Rating
            if (fetchedReviews.length > 0) {
                const total = fetchedReviews.reduce((sum, r) => sum + r.rating, 0);
                setAvgRating((total / fetchedReviews.length).toFixed(1));
            }

            // Sort by date (client side as generic index might be missing)
            fetchedReviews.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setReviews(fetchedReviews);

            // 2. Check Permission (if logged in)
            if (auth.currentUser) {
                const ordersQ = query(
                    collection(db, "orders"),
                    where("userId", "==", auth.currentUser.uid)
                );
                const ordersSnapshot = await getDocs(ordersQ);
                // Check if any order contains items from this restaurant
                const hasOrdered = ordersSnapshot.docs.some(doc => {
                    const data = doc.data();
                    return data.items && data.items.some(item => item.restaurantId === restaurant.id);
                });
                setCanReview(hasOrdered);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    React.useEffect(() => {
        fetchReviewsAndCheckPermission();
    }, [restaurant]);

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
                            <span>★</span> {avgRating} <span className='text-xs font-normal opacity-80'>({reviews.length})</span>
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
                                                onClick={() => {
                                                    addToCart({ ...item, restaurantId: restaurant.id });
                                                    showToast(`${item.name} added to cart!`, 'success');
                                                }}
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


            {/* Reviews Section */}
            <div className="bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-gray-800 py-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h2>
                        {canReview && (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md transition-transform transform hover:scale-105"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    {reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No reviews yet. {canReview ? "Be the first to review!" : "Order now to leave a review."}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-[#2a2a2a] p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                                {review.userName?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{review.userName || "User"}</h4>
                                                <div className="flex text-yellow-400 text-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {
                showReviewModal && (
                    <ReviewModal
                        restaurantId={restaurant.id}
                        onClose={() => setShowReviewModal(false)}
                        onReviewAdded={fetchReviewsAndCheckPermission}
                    />
                )
            }
            <Footer />
        </div >
    );
}
