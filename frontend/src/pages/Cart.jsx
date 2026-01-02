import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
    const { cartItems, updateQuantity, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponMsg, setCouponMsg] = useState({ text: "", type: "" }); // type: success/error

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
            // Logic: 50% off up to ₹100
            const disc = Math.min(100, Math.round(itemTotal * 0.5));
            setDiscount(disc);
            setCouponMsg({ text: `Coupon Applied! You saved ₹${disc}`, type: "success" });
        }
        else if (code === "NEWUSER50") {
            // One-time use logic
            const hasRedeemed = localStorage.getItem('redeemed_NEWUSER50');
            if (hasRedeemed) {
                setCouponMsg({ text: "This coupon is valid for new users only.", type: "error" });
            } else {
                const disc = Math.round(itemTotal * 0.5); // Flat 50%
                setDiscount(disc);
                setCouponMsg({ text: `New User Bonus! ₹${disc} OFF applied.`, type: "success" });
            }
        }
        else if (code === "FREEDEL") {
            if (itemTotal > 149) {
                setDiscount(deliveryFee);
                setCouponMsg({ text: "Free Delivery Applied!", type: "success" });
            } else {
                setCouponMsg({ text: "Add items worth ₹149 to avail free delivery.", type: "error" });
            }
        }
        else {
            setCouponMsg({ text: "Invalid Coupon Code", type: "error" });
        }
    };

    const handlePlaceOrder = () => {
        const itemNames = cartItems.map(i => `${i.name} (x${i.quantity})`).join(", ");
        const confirmPayment = window.confirm(`Proceed to pay ₹${toPay} for:\n${itemNames}?`);

        if (confirmPayment) {
            // Mark NEWUSER50 as redeemed if used
            if (couponCode.trim().toUpperCase() === "NEWUSER50" && discount > 0) {
                localStorage.setItem('redeemed_NEWUSER50', 'true');
            }

            // Save Order to History
            const newOrder = {
                id: Math.floor(100000 + Math.random() * 900000), // Random 6 digit ID
                date: new Date().toISOString(),
                items: cartItems,
                total: toPay,
                status: 'Delivered'
            };

            const existingHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
            localStorage.setItem('orderHistory', JSON.stringify([...existingHistory, newOrder]));

            // Simulate Gateway
            const processing = window.open("", "_blank", "width=400,height=300");
            processing.document.write(`<h2 style="font-family:sans-serif;text-align:center;margin-top:50px;">Connecting to Payment Gateway...</h2>`);

            setTimeout(() => {
                processing.document.body.innerHTML = `<h2 style="font-family:sans-serif;text-align:center;color:green;margin-top:50px;">Payment Successful!</h2><p style="text-align:center">Redirecting...</p>`;
                setTimeout(() => {
                    processing.close();
                    alert(`Order Placed Successfully!\n\nItems Ordered:\n${itemNames}`);
                    clearCart();
                }, 2000);
            }, 2000);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" width="200" alt="Empty Cart" className="mb-6 opacity-80" />
                    <h2 className="mb-3 text-2xl font-bold text-gray-400">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">You can go to home page to view more restaurants</p>
                    <Link to="/">
                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95">
                            See Restaurants Near You
                        </button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cart Items ({cartItems.length})</h2>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side: Cart Items */}
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-grow min-w-0">
                                    <h5 className="font-bold text-gray-900 dark:text-white truncate">{item.name}</h5>
                                    <div className="text-red-500 font-bold">{item.price}</div>
                                </div>

                                <div className="flex items-center bg-gray-100 dark:bg-[#2a2a2a] rounded-lg px-2">
                                    <button
                                        className="text-red-500 font-bold text-xl px-3 py-1 hover:bg-black/5 rounded"
                                        onClick={() => updateQuantity(item.id, -1)}
                                    >-</button>
                                    <span className="font-bold text-gray-900 dark:text-white mx-2 w-4 text-center">{item.quantity}</span>
                                    <button
                                        className="text-green-600 font-bold text-xl px-3 py-1 hover:bg-black/5 rounded"
                                        onClick={() => updateQuantity(item.id, 1)}
                                    >+</button>
                                </div>

                                <div className="font-bold text-gray-900 dark:text-white text-lg min-w-[3rem] text-right">
                                    ₹{item.price ? (parseInt(item.price.replace(/[^0-9]/g, '') || '0') * item.quantity) : 0}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Bill Details */}
                    <div className="lg:w-1/3">
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-700 pb-4">Bill Details</h4>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Item Total</span>
                                    <span>₹{itemTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Delivery Fee</span>
                                    <span>₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Taxes and Charges</span>
                                    <span>₹{taxes}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-xl mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🏷️</span>
                                    <span className="font-bold text-xs text-gray-500 dark:text-gray-400 tracking-wider">HAVE A COUPON?</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-grow bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="CODE"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button
                                        className="bg-gray-900 dark:bg-white text-white dark:text-black font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                                        onClick={applyCoupon}
                                    >
                                        APPLY
                                    </button>
                                </div>
                                {couponMsg.text && (
                                    <div className={`mt-3 text-xs font-medium p-2 rounded ${couponMsg.type === 'success'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {couponMsg.text}
                                    </div>
                                )}
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between mb-4 text-green-600 font-bold border-t border-dashed dark:border-gray-700 pt-4">
                                    <span>Discount Applied</span>
                                    <span>- ₹{discount}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-6 pt-4 border-t dark:border-gray-700">
                                <span className="font-bold text-gray-900 dark:text-white text-lg">TO PAY</span>
                                <span className="font-bold text-gray-900 dark:text-white text-xl">₹{toPay}</span>
                            </div>

                            <button
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md transition-transform transform active:scale-95 text-lg uppercase tracking-wide"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
