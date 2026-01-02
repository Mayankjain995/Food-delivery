import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingBag, ArrowRight, Trash2, MapPin, CreditCard, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, updateInstructions, clearCart } = useCart();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // UI States
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponMsg, setCouponMsg] = useState({ text: "", type: "" });
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchAddresses = async () => {
            if (!auth.currentUser) {
                setLoading(false);
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setAddresses(data.addresses || []);
                    if (data.addresses?.length > 0) setSelectedAddress(data.addresses[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    const itemTotal = cartItems.reduce((sum, item) => {
        const priceString = item.price ? item.price.toString() : '0';
        const price = parseInt(priceString.replace(/[^0-9]/g, '') || '0');
        return sum + (price * item.quantity);
    }, 0);

    const deliveryFee = itemTotal > 0 ? 40 : 0;
    const taxes = Math.round(itemTotal * 0.05);
    const grandTotalBeforeDiscount = itemTotal + deliveryFee + taxes;
    const toPay = Math.max(0, grandTotalBeforeDiscount - discount);

    const applyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        setDiscount(0);
        setCouponMsg({ text: "", type: "" });

        if (!code) return;

        if (code === "WELCOME50") {
            const disc = Math.min(100, Math.round(itemTotal * 0.5));
            setDiscount(disc);
            setCouponMsg({ text: `Matched! ₹${disc} OFF applied.`, type: "success" });
        } else if (code === "FREEDEL" && itemTotal > 149) {
            setDiscount(deliveryFee);
            setCouponMsg({ text: "Free Delivery!", type: "success" });
        } else {
            setCouponMsg({ text: "Invalid or Conditions unmet", type: "error" });
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            showToast("Please add/select a delivery address", "error");
            return;
        }

        try {
            const newOrder = {
                date: new Date().toISOString(),
                items: cartItems,
                total: toPay,
                status: 'Order Placed',
                paymentMethod,
                deliveryAddress: selectedAddress,
                restaurantId: cartItems[0]?.restaurantId || 'unknown',
                userId: auth.currentUser?.uid || 'guest',
                userName: auth.currentUser?.displayName || 'Guest User',
                userEmail: auth.currentUser?.email || 'guest'
            };

            const processing = window.open("", "_blank", "width=400,height=300");
            processing.document.write(`<h2 style="font-family:sans-serif;text-align:center;margin-top:50px;">Processing ${paymentMethod.toUpperCase()} Payment...</h2>`);

            setTimeout(async () => {
                const docRef = await addDoc(collection(db, "orders"), newOrder);
                processing.close();
                clearCart();
                showToast("Order Placed Successfully!");
                navigate(`/order-status/${docRef.id}`);
            }, 2000);

        } catch (error) {
            console.error(error);
            showToast("Failed to place order", "error");
        }
    };

    if (loading) return <LoadingSpinner fullScreen={true} />;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 flex flex-col">
                <Navbar />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-grow flex flex-col items-center justify-center p-8 text-center"
                >
                    <div className="relative mb-12">
                        <div className="w-48 h-48 bg-white dark:bg-[#1e1e1e] rounded-[3rem] flex items-center justify-center shadow-2xl border border-gray-100 dark:border-gray-800 relative z-10">
                            <ShoppingBag size={80} className="text-gray-100 dark:text-gray-800" />
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <ShoppingBag size={80} className="text-red-500/20" />
                            </motion.div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-500/30 rotate-12 z-20">
                            <ArrowRight size={32} />
                        </div>
                    </div>

                    <h2 className="text-4xl font-black mb-4 tracking-tight">Your cart is empty</h2>
                    <p className="text-gray-400 font-bold text-sm mb-10 max-w-xs mx-auto leading-relaxed uppercase tracking-widest">Delicious discoveries are just a tap away. Let's find something for you!</p>

                    <Link to="/">
                        <button className="group bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 px-12 rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 uppercase tracking-[0.2em] text-xs">
                            Start Exploring
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </Link>
                </motion.div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Items and Checkout Sections */}
                    <div className="lg:w-2/3 space-y-10">
                        {/* Cart Items */}
                        <section>
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                                <span className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600">🛒</span>
                                Your Cart
                            </h2>
                            <div className="space-y-4">
                                {cartItems.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-all">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>

                                        <div className="flex-grow text-center md:text-left">
                                            <h3 className="text-lg font-black">{item.name}</h3>
                                            <p className="text-red-500 font-bold mb-2">{item.price}</p>

                                            {item.options && item.options.length > 0 && (
                                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                                                    {item.options.map((opt, i) => (
                                                        <span key={i} className="text-[10px] bg-gray-100 dark:bg-black/40 px-2 py-0.5 rounded-full font-black text-gray-400 uppercase tracking-widest">{opt}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                                <span className="text-[10px] font-black text-gray-300 uppercase italic">Inst:</span>
                                                <input
                                                    type="text"
                                                    value={item.instructions || ''}
                                                    onChange={(e) => updateInstructions(item.id, item.options, e.target.value)}
                                                    placeholder="Add note..."
                                                    className="bg-transparent border-b border-gray-200 dark:border-gray-800 text-xs py-1 focus:border-red-500 outline-none w-full max-w-[200px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-black/20 p-2 rounded-2xl">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.options, -1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-gray-800 font-black text-red-500 transition-all"
                                            >-</button>
                                            <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.options, 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-gray-800 font-black text-green-500 transition-all"
                                            >+</button>
                                        </div>

                                        <div className="font-black text-xl min-w-[80px] text-right">
                                            ₹{item.price ? (parseInt(item.price.replace(/[^0-9]/g, '') || '0') * item.quantity) : 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Delivery Address */}
                        <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 text-sm">📍</span>
                                Delivery Address
                            </h3>

                            {addresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map(addr => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddress(addr)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress?.id === addr.id ? 'border-red-500 bg-red-50/50 dark:bg-red-900/5' : 'border-gray-100 dark:border-gray-800'}`}
                                        >
                                            <span className="block text-[10px] font-black uppercase text-gray-400 mb-1">{addr.label}</span>
                                            <p className="text-sm font-medium leading-tight">{addr.fullAddress}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-400 text-sm mb-4 italic">No addresses saved. Add one in your profile.</p>
                                    <button onClick={() => navigate('/profile')} className="text-red-500 font-black hover:underline text-sm">Go to Profile</button>
                                </div>
                            )}
                        </section>

                        {/* Payment Method */}
                        <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <span className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 text-sm">💳</span>
                                Payment Method
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {['upi', 'card', 'cod'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`px-8 py-4 rounded-2xl border-2 font-black text-sm uppercase tracking-widest transition-all ${paymentMethod === method ? 'border-red-500 bg-red-500 text-white' : 'border-gray-100 dark:border-gray-800 hover:border-red-200'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sticky top-24">
                            <h4 className="text-2xl font-black mb-8 border-b dark:border-gray-800 pb-6">Payment Summary</h4>

                            <div className="space-y-4 mb-4">
                                <div className="flex justify-between items-center text-gray-500 font-bold text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{itemTotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-bold text-sm">
                                    <span>Delivery Fee</span>
                                    <span className={deliveryFee === 0 ? 'text-green-500' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-bold text-sm">
                                    <span>GST & Taxes (5%)</span>
                                    <span>₹{taxes}</span>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl mb-8">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="APPLY COUPON"
                                        className="flex-grow bg-white dark:bg-[#2a2a2a] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 active:scale-95"
                                    >Apply</button>
                                </div>
                                {couponMsg.text && (
                                    <p className={`mt-2 text-[10px] font-black uppercase text-center ${couponMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{couponMsg.text}</p>
                                )}
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between items-center text-green-500 font-black mb-6">
                                    <span>Discount Applied</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center bg-gray-900 dark:bg-white text-white dark:text-black p-6 rounded-3xl mb-8 shadow-2xl scale-105">
                                <div>
                                    <span className="block text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Total to Pay</span>
                                    <span className="text-3xl font-black">₹{toPay}</span>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 justify-end mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-[8px] uppercase font-black tracking-widest">Safe Payment</span>
                                    </div>
                                    <span className="text-[10px] font-bold opacity-60">Incl. GST & Fees</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full py-6 bg-red-600 hover:bg-red-700 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-red-500/40 hover:-translate-y-1 mb-6"
                            >
                                Pay & Secure Order
                            </button>

                            <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">25-30 Mins</span>
                                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Contactless</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
