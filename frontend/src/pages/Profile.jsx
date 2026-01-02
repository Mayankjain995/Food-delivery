import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Profile({ user }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const { isDarkMode } = useTheme();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleReorder = (orderItems) => {
        orderItems.forEach(item => {
            addToCart(item);
        });
        alert("Items added to cart for reorder!");
        navigate('/cart');
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                // Fetch from Firestore
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid)
                    // orderBy("date", "desc") // Requires index, doing client-side sort for now to avoid error
                );
                const querySnapshot = await getDocs(q);
                const firestoreOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Client-side sort
                firestoreOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

                setOrders(firestoreOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                // Fallback to local storage if firestore fails (or for guest checkout orders)
                const storedOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
                setOrders(storedOrders.reverse());
            }
        };

        fetchOrders();
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            showToast("Logged out successfully");
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
            showToast("Logout failed", "error");
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / User Card */}
                    <div className="md:w-1/3 lg:w-1/4">
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 text-center sticky top-24">
                            <div className="mb-6 relative inline-block">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white flex items-center justify-center text-4xl font-bold mx-auto shadow-lg">
                                    {user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-[#1e1e1e]"></div>
                            </div>

                            <h3 className="font-bold text-xl mb-1 truncate">{user.email.split('@')[0]}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 truncate" title={user.email}>{user.email}</p>

                            <div className="space-y-3">
                                <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-500/10 text-red-600 dark:text-red-400 font-medium py-2 rounded-lg hover:bg-red-500/20 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Order History */}
                    <div className="md:w-2/3 lg:w-3/4">
                        <h3 className="text-2xl font-bold mb-6">Order History</h3>

                        {orders.length === 0 ? (
                            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No past orders found.</p>
                                <button onClick={() => navigate('/')} className="mt-4 text-red-500 font-medium hover:underline">
                                    Start ordering now
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, index) => (
                                    <div key={index} className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="bg-gray-50 dark:bg-[#2a2a2a]/50 p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                                            <div className="flex gap-4 items-center">
                                                <span className="font-mono font-bold text-gray-500 dark:text-gray-400">#{order.id.slice(0, 8)}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-gray-600 pl-4">{new Date(order.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <button
                                                    onClick={() => navigate(`/order-status/${order.id}`)}
                                                    className="text-xs bg-red-500 text-white px-3 py-1 rounded-full font-bold hover:bg-red-600 transition-colors"
                                                >
                                                    Track Order
                                                </button>
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {order.items.map((item, idx) => (
                                                    <span key={idx} className="bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm">
                                                        <span className="font-bold mr-1">{item.quantity}x</span> {item.name}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Total Amount</span>
                                                    <span className="text-xl font-bold">₹{order.total}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleReorder(order.items)}
                                                    className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                                                >
                                                    Reorder
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
