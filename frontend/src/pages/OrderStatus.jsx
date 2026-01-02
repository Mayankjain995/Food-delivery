import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Send, CheckCircle } from "lucide-react";
import { collection, addDoc, updateDoc, onSnapshot, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

export default function OrderStatus() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [foodRating, setFoodRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    useEffect(() => {
        if (!id) return;

        const unsub = onSnapshot(doc(db, "orders", id), (docFn) => {
            if (docFn.exists()) {
                const data = docFn.data();
                setOrder({ id: docFn.id, ...data });
                if (data.feedbackSubmitted) setFeedbackSubmitted(true);
            } else {
                console.error("Order not found");
            }
            setLoading(false);
        });

        return () => unsub();
    }, [id]);

    const handleFeedbackSubmit = async () => {
        if (foodRating === 0 || deliveryRating === 0) {
            showToast("Please rate both food and delivery", "error");
            return;
        }

        const resId = order.restaurantId || order.items?.[0]?.restaurantId;
        if (!resId) {
            console.error("Missing restaurantId for feedback", order);
            showToast("Internal Error: Missing data", "error");
            return;
        }

        setSubmittingFeedback(true);
        try {
            await addDoc(collection(db, "reviews"), {
                orderId: id,
                restaurantId: typeof resId === 'string' ? parseInt(resId) : resId,
                userId: order.userId,
                userName: order.userName || 'Anonymous User',
                rating: foodRating, // Primary rating used for restaurant display
                foodRating,
                deliveryRating,
                comment: feedback,
                createdAt: serverTimestamp()
            });
            await updateDoc(doc(db, "orders", id), { feedbackSubmitted: true });
            setFeedbackSubmitted(true);
            showToast("Feedback submitted successfully!");
        } catch (error) {
            console.error("Error submitting feedback:", error);
            showToast("Failed to submit feedback", "error");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen={true} />;
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Order not found</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-red-500 text-white px-6 py-2 rounded-full font-bold"
                >
                    Go Home
                </button>
            </div>
        );
    }

    const currentStepIndex = STEPS.findIndex((s) => s.status === order.status);
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 flex flex-col">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12 w-full flex-grow">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12 border-b dark:border-gray-800 pb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activeIndex >= 3 ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 animate-pulse'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                                Ordered {new Date(order.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>

                            <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest">
                                <span className="px-4 py-2 bg-gray-50 dark:bg-black/20 rounded-xl text-gray-500 border dark:border-gray-800">💳 {order.paymentMethod || 'Paid Online'}</span>
                                <span className="px-4 py-2 bg-gray-50 dark:bg-black/20 rounded-xl text-gray-500 border dark:border-gray-800">📍 {order.deliveryAddress?.label || 'Home'}</span>
                            </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto p-6 rounded-3xl bg-gray-50 dark:bg-black/10 border dark:border-gray-800">
                            <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Amount</span>
                            <span className="text-5xl font-black text-red-500">₹{order.total}</span>
                        </div>
                    </div>

                    {/* Modern Live Tracking Map */}
                    <div className="mb-12 rounded-[2.5rem] overflow-hidden h-96 bg-gray-100 dark:bg-[#0a0a0a] relative border-4 border-white dark:border-[#2a2a2a] shadow-inner group">
                        {/* Map Grid Overlay */}
                        <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                            <defs>
                                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#22c55e" />
                                </linearGradient>
                            </defs>

                            {/* Roads */}
                            <path d="M0,200 L800,200 M400,0 L400,400 M100,50 L700,50 M100,350 L700,350" fill="none" stroke="#cbd5e1" dark:stroke="#1e293b" strokeWidth="30" strokeOpacity="0.1" />

                            {/* The Delivery Path */}
                            <motion.path
                                d="M150,300 L150,150 L400,150 L400,250 L650,250"
                                fill="none"
                                stroke="#f1f5f9"
                                dark:stroke="#1e293b"
                                strokeWidth="8"
                                strokeLinecap="round"
                            />
                            <motion.path
                                d="M150,300 L150,150 L400,150 L400,250 L650,250"
                                fill="none"
                                stroke="url(#pathGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray="1000"
                                initial={{ strokeDashoffset: 1000 }}
                                animate={{ strokeDashoffset: 1000 - (activeIndex * 250) }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />

                            {/* Source: Restaurant */}
                            <g transform="translate(150, 300)">
                                <circle r="20" fill="#ef4444" fillOpacity="0.1" />
                                <circle r="8" fill="#ef4444" />
                                <text y="35" textAnchor="middle" className="text-[10px] font-black fill-gray-400 dark:fill-gray-500 uppercase tracking-widest">Kitchen</text>
                            </g>

                            {/* Destination: Home */}
                            <g transform="translate(650, 250)">
                                <circle r="20" fill="#22c55e" fillOpacity="0.1" />
                                <circle r="8" fill="#22c55e" />
                                <text y="35" textAnchor="middle" className="text-[10px] font-black fill-gray-400 dark:fill-gray-500 uppercase tracking-widest">You</text>
                            </g>

                            {/* Delivery Boy Animation */}
                            <motion.g
                                animate={{
                                    x: activeIndex === 0 ? 150 : activeIndex === 1 ? 150 : activeIndex === 2 ? 400 : 650,
                                    y: activeIndex === 0 ? 300 : activeIndex === 1 ? 150 : activeIndex === 2 ? 150 : 250
                                }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                            >
                                <motion.circle r="25" fill="#ef4444" fillOpacity="0.2" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
                                <text x="-15" y="10" className="text-2xl drop-shadow-lg">🛵</text>
                            </motion.g>
                        </svg>

                        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between bg-white/95 dark:bg-black/90 backdrop-blur-2xl p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-3xl shadow-inner border border-red-100 dark:border-red-900/30">
                                    {activeIndex === 0 ? "🔥" : activeIndex === 1 ? "👨‍🍳" : activeIndex === 2 ? "🚀" : "🎁"}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status Update</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                                        {activeIndex === 0 ? "Baking your happiness..." :
                                            activeIndex === 1 ? "Chef is finishing up" :
                                                activeIndex === 2 ? "Valari is on the way" :
                                                    "Enjoy your meal!"}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Time Left</p>
                                <p className="text-xl font-black text-red-500 tracking-tighter">{activeIndex >= 3 ? "Delivered" : (25 - activeIndex * 5) + "m remaining"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Post-Delivery Feedback Section */}
                    <AnimatePresence>
                        {activeIndex >= 3 && !feedbackSubmitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="mb-12 p-10 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 rounded-[2.5rem] border-2 border-red-100 dark:border-red-900/20 shadow-xl"
                            >
                                <div className="text-center mb-10">
                                    <h3 className="text-3xl font-black mb-2 tracking-tight">How was the food?</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">Your feedback helps us and the restaurant grow!</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block text-center">Rate Food Quality</label>
                                        <div className="flex justify-center gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setFoodRating(star)}
                                                    className={`p-2 transition-all ${foodRating >= star ? 'text-yellow-400 scale-125' : 'text-gray-300 dark:text-gray-700'}`}
                                                >
                                                    <Star size={32} fill={foodRating >= star ? "currentColor" : "none"} strokeWidth={2.5} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block text-center">Rate Delivery Speed</label>
                                        <div className="flex justify-center gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setDeliveryRating(star)}
                                                    className={`p-2 transition-all ${deliveryRating >= star ? 'text-blue-500 scale-125' : 'text-gray-300 dark:text-gray-700'}`}
                                                >
                                                    <Star size={32} fill={deliveryRating >= star ? "currentColor" : "none"} strokeWidth={2.5} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative mb-8">
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Add a comment (optional)..."
                                        className="w-full p-6 pb-20 bg-white dark:bg-black/40 rounded-3xl border-2 border-transparent focus:border-red-500 outline-none text-sm font-bold transition-all shadow-inner resize-none min-h-[140px]"
                                    />
                                    <button
                                        disabled={foodRating === 0 || deliveryRating === 0 || submittingFeedback}
                                        onClick={handleFeedbackSubmit}
                                        className="absolute bottom-6 right-6 px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-red-500/20 hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                                    >
                                        {submittingFeedback ? "Sending..." : "Submit Review"} <Send size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {feedbackSubmitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-12 p-10 bg-green-50 dark:bg-green-900/10 rounded-[2.5rem] border-2 border-green-100 dark:border-green-900/20 text-center"
                            >
                                <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-3xl font-black mb-2 tracking-tight">Review Received!</h3>
                                <p className="text-green-600 dark:text-green-400 font-bold text-sm">Thank you for making us better. Enjoy your meal!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stepper UI */}
                    <div className="relative mb-16 px-4">
                        <div className="absolute left-10 right-10 top-5 h-2 bg-gray-100 dark:bg-gray-800 -z-0 rounded-full"></div>
                        <div
                            className="absolute left-10 top-5 h-2 bg-gradient-to-r from-red-500 to-green-500 transition-all duration-[2000ms] ease-out -z-0 rounded-full shadow-lg"
                            style={{ width: `${(activeIndex / (STEPS.length - 1)) * (100 - (20))}%` }}
                        ></div>

                        <div className="flex justify-between relative z-10 w-full">
                            {STEPS.map((step, index) => {
                                const isCompleted = index <= activeIndex;
                                const isCurrent = index === activeIndex;

                                return (
                                    <div key={index} className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black text-sm transition-all duration-700 ${isCompleted
                                                ? "bg-white dark:bg-[#1e1e1e] text-red-500 shadow-2xl scale-110 border-2 border-red-500"
                                                : "bg-gray-50 dark:bg-black/20 text-gray-300 dark:text-gray-700 border-2 border-transparent"
                                                }`}
                                        >
                                            {isCompleted ? (isCurrent ? "🔥" : "✓") : index + 1}
                                        </div>
                                        <div className="text-center mt-6">
                                            <span
                                                className={`block text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isCurrent
                                                    ? "text-red-500"
                                                    : isCompleted
                                                        ? "text-gray-900 dark:text-white"
                                                        : "text-gray-300 dark:text-gray-700"
                                                    }`}
                                            >
                                                {step.label}
                                            </span>
                                            {isCurrent && <span className="text-[8px] italic font-bold text-red-400/50 animate-pulse mt-1 block">In Progress...</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 dark:bg-black/10 rounded-[2rem] p-8 border dark:border-gray-800">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 border-b dark:border-gray-800 pb-4">Items Summary</h3>
                        <div className="space-y-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex-grow">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-red-500 text-xs bg-red-100 dark:bg-red-900/20 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/30">
                                                {item.quantity}x
                                            </span>
                                            <span className="font-black text-lg">{item.name}</span>
                                        </div>
                                        <span className="font-black text-lg text-gray-400">
                                            ₹{item.price * item.quantity}
                                        </span>
                                    </div>

                                    {(item.options?.length > 0 || item.instructions) && (
                                        <div className="ml-16 space-y-2">
                                            {item.options?.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.options.map((opt, i) => (
                                                        <span key={i} className="text-[10px] font-black uppercase tracking-widest bg-white dark:bg-black/20 text-gray-400 px-3 py-1 rounded-lg border dark:border-gray-800">
                                                            + {opt}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {item.instructions && (
                                                <p className="text-xs text-gray-400 font-bold bg-white/50 dark:bg-black/20 p-3 rounded-xl border dark:border-gray-800 inline-block">
                                                    <span className="font-black uppercase text-[10px] text-red-500 mr-2">廚 Instruction:</span>
                                                    {item.instructions}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Debug/Demo Control */}
                    <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/10 border-2 border-dashed border-yellow-200 dark:border-yellow-900/30 rounded-3xl">
                        <p className="text-[10px] font-black text-center text-yellow-600 uppercase tracking-widest mb-4">Demo Admin Panel: Simulate Status</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {STEPS.map(s => (
                                <button
                                    key={s.status}
                                    disabled={order.status === s.status}
                                    onClick={async () => {
                                        try {
                                            const { updateDoc, doc } = await import("firebase/firestore");
                                            await updateDoc(doc(db, "orders", id), { status: s.status });
                                            showToast(`Simulated: ${s.label}`);
                                        } catch (e) {
                                            console.error(e);
                                            showToast("Simulate failed", "error");
                                        }
                                    }}
                                    className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === s.status
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-white dark:bg-[#1e1e1e] border-2 border-yellow-100 dark:border-yellow-900/20 text-yellow-600 hover:shadow-lg'}`}
                                >
                                    Set {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}

const STEPS = [
    { label: "Placed", status: "Order Placed" },
    { label: "Chef", status: "Preparing" },
    { label: "Zooming", status: "Out for Delivery" },
    { label: "Delivered", status: "Delivered" },
];
