import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { LogOut, Home as HomeIcon, Briefcase, MapPin, Trash2, AlertCircle, Pencil, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Profile({ user }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [preferences, setPreferences] = useState({ isVeg: false, favCuisines: [] });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const { isDarkMode } = useTheme();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                // Fetch Orders
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const firestoreOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                firestoreOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(firestoreOrders);

                // Fetch User Metadata (Addresses & Preferences)
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setAddresses(data.addresses || []);
                    setPreferences(data.preferences || { isVeg: false, favCuisines: [] });
                } else {
                    // Initialize user doc if not exists
                    await setDoc(doc(db, "users", user.uid), {
                        email: user.email,
                        addresses: [],
                        preferences: { isVeg: false, favCuisines: [] }
                    }, { merge: true });
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                showToast("Failed to load profile details", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleUpdateProfile = async () => {
        try {
            await updateProfile(auth.currentUser, { displayName });
            await updateDoc(doc(db, "users", user.uid), { displayName });
            setIsEditing(false);
            showToast("Profile updated successfully!");
        } catch (error) {
            showToast("Failed to update profile", "error");
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const label = formData.get('label');
        const newAddr = {
            id: Date.now(),
            label: label,
            fullAddress: formData.get('address')
        };
        try {
            await updateDoc(doc(db, "users", user.uid), {
                addresses: arrayUnion(newAddr)
            });
            setAddresses(prev => [...prev, newAddr]);
            e.target.reset();
            showToast("Address added!");
        } catch (error) {
            showToast("Failed to add address", "error");
        }
    };

    const handleRemoveAddress = async (addr) => {
        try {
            await updateDoc(doc(db, "users", user.uid), {
                addresses: arrayRemove(addr)
            });
            setAddresses(prev => prev.filter(a => a.id !== addr.id));
            showToast("Address removed");
        } catch (error) {
            showToast("Failed to remove address", "error");
        }
    };

    const getAddressIcon = (label) => {
        const l = label.toLowerCase();
        if (l.includes('home')) return <HomeIcon size={16} />;
        if (l.includes('work') || l.includes('office')) return <Briefcase size={16} />;
        return <MapPin size={16} />;
    };

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

    const togglePreference = async (pref) => {
        const newPrefs = { ...preferences, [pref]: !preferences[pref] };
        try {
            await updateDoc(doc(db, "users", user.uid), { preferences: newPrefs });
            setPreferences(newPrefs);
            showToast("Preferences updated!");
        } catch (error) {
            showToast("Failed to update preferences", "error");
        }
    };

    const handleReorder = (orderItems) => {
        orderItems.forEach(item => {
            addToCart(item);
        });
        showToast("Added to cart for reorder!");
        navigate('/cart');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return <LoadingSpinner fullScreen={true} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar: Profile Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center sticky top-24 overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-pink-600"></div>

                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="mb-6 relative inline-block"
                            >
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-5xl font-black mx-auto shadow-inner border-4 border-white dark:border-gray-800 relative overflow-hidden">
                                    <span className="relative z-10 bg-gradient-to-br from-red-500 to-pink-600 bg-clip-text text-transparent">
                                        {(displayName || user.email).charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-[#1e1e1e] shadow-lg animate-pulse"></div>
                            </motion.div>

                            {isEditing ? (
                                <div className="space-y-4 mb-6">
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full px-6 py-3 rounded-2xl border-2 border-gray-100 dark:border-gray-800 dark:bg-black/20 focus:border-red-500 outline-none text-center font-black"
                                        placeholder="Your Name"
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={handleUpdateProfile} className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-red-500/20 active:scale-95 transition-all">Save</button>
                                        <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 dark:bg-gray-800 py-3 rounded-2xl font-black text-sm active:scale-95 transition-all">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-8">
                                    <h3 className="font-black text-3xl mb-1 truncate tracking-tight">{displayName || user.email.split('@')[0]}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-4 truncate">{user.email}</p>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 mx-auto bg-gray-50 dark:bg-black/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors border dark:border-gray-800"
                                    >
                                        <Pencil size={12} /> Edit Profile
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 border-y dark:border-gray-800 py-6 mb-8 mx-[-2rem] px-8 bg-gray-50/50 dark:bg-black/10">
                                <div className="text-center">
                                    <span className="block text-2xl font-black text-gray-900 dark:text-white">{orders.length}</span>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Total Orders</span>
                                </div>
                                <div className="text-center border-l dark:border-gray-800">
                                    <span className="block text-2xl font-black text-gray-900 dark:text-white">{addresses.length}</span>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Saved Spots</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl font-black shadow-sm text-sm bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 transition-all active:scale-95 uppercase tracking-widest"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Logout Confirmation Modal */}
                    <AnimatePresence>
                        {showLogoutConfirm && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                                />
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    className="relative bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border border-gray-100 dark:border-gray-800"
                                >
                                    <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <AlertCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">Leaving so soon?</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-8 leading-relaxed">Are you sure you want to log out from the most delicious app in town?</p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black tracking-widest text-sm uppercase shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                                        >
                                            Logout
                                        </button>
                                        <button
                                            onClick={() => setShowLogoutConfirm(false)}
                                            className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black tracking-widest text-sm uppercase active:scale-95 transition-all"
                                        >
                                            Stay here
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Main Content Areas */}
                    <div className="lg:w-2/3 space-y-10">
                        {/* Address Management Section */}
                        <section className="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                            <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                                <span className="p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl text-red-500">
                                    <MapPin size={24} />
                                </span>
                                Manage Addresses
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {addresses.map(addr => (
                                    <div key={addr.id} className="p-6 rounded-3xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-black/5 relative group hover:border-red-500/20 transition-all">
                                        <button
                                            onClick={() => handleRemoveAddress(addr)}
                                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-xl transition-all shadow-lg active:scale-90"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-red-500 shadow-sm">
                                                {getAddressIcon(addr.label)}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{addr.label}</span>
                                        </div>
                                        <p className="text-sm font-bold leading-relaxed text-gray-700 dark:text-gray-300">{addr.fullAddress}</p>
                                    </div>
                                ))}

                                {addresses.length === 0 && (
                                    <div className="col-span-full text-center py-10 bg-gray-50 dark:bg-black/10 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No saved spots yet</p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleAddAddress} className="flex flex-col md:flex-row gap-3 bg-gray-50 dark:bg-black/10 p-5 rounded-[2rem] border dark:border-gray-800">
                                <div className="relative flex-1">
                                    <input name="label" required placeholder="Label (Home, Work...)" className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-[#1e1e1e] border-2 border-transparent focus:border-red-500 outline-none text-sm font-bold transition-all shadow-sm" />
                                </div>
                                <div className="relative md:flex-[2]">
                                    <input name="address" required placeholder="Full Delivery Address" className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-[#1e1e1e] border-2 border-transparent focus:border-red-500 outline-none text-sm font-bold transition-all shadow-sm" />
                                </div>
                                <button type="submit" className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95">Add</button>
                            </form>
                        </section>

                        {/* Food Preferences Section */}
                        <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                                <span className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 text-sm">🥗</span>
                                Diet Preferences
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black/20">
                                    <div>
                                        <h4 className="font-bold">Pure Veg Mode</h4>
                                        <p className="text-xs text-gray-400">Default to vegetarian options only</p>
                                    </div>
                                    <button
                                        onClick={() => togglePreference('isVeg')}
                                        className={`w-14 h-8 rounded-full p-1 transition-all ${preferences.isVeg ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${preferences.isVeg ? 'translate-x-6' : ''}`}></div>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border-2 border-transparent hover:border-red-500/20 transition-all">
                                    <div>
                                        <h4 className="font-bold flex items-center gap-2">
                                            Jain Special
                                            <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">New</span>
                                        </h4>
                                        <p className="text-xs text-gray-400">Hide items with Onion, Garlic or Root vegetables</p>
                                    </div>
                                    <button
                                        onClick={() => togglePreference('isJain')}
                                        className={`w-14 h-8 rounded-full p-1 transition-all ${preferences.isJain ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-gray-300 dark:bg-gray-700'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${preferences.isJain ? 'translate-x-6' : ''}`}></div>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Order History Section */}
                        <section>
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                                <span className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 text-sm">🛍️</span>
                                Past Orders
                            </h2>

                            {orders.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-800"
                                >
                                    <div className="w-24 h-24 bg-gray-50 dark:bg-black/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border dark:border-gray-800">
                                        <ShoppingBag size={40} className="text-gray-300 dark:text-gray-700" />
                                    </div>
                                    <h4 className="text-2xl font-black mb-2 tracking-tight">Food-less state!</h4>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">You haven't ordered anything yet. Let's fix that!</p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="inline-flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-[10px] bg-red-50 dark:bg-red-900/10 px-6 py-3 rounded-xl hover:bg-red-100 transition-all active:scale-95"
                                    >
                                        Explore Menu <ArrowRight size={14} />
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={order.id}
                                            className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all group"
                                        >
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-black text-gray-400 text-xs">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-2xl font-black">₹{order.total}</span>
                                                        <button
                                                            onClick={() => navigate(`/order-status/${order.id}`)}
                                                            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 justify-end mt-1"
                                                        >
                                                            Track Order ➔
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 px-3 py-1.5 rounded-xl border dark:border-gray-800">
                                                            <span className="text-xs font-black text-red-500">{item.quantity}x</span>
                                                            <span className="text-xs font-bold truncate max-w-[120px]">{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleReorder(order.items)}
                                                        className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm transition-all hover:bg-black dark:hover:bg-gray-100 active:scale-95 shadow-lg"
                                                    >
                                                        Quick Reorder
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
