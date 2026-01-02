import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

const STEPS = [
    { label: "Order Placed", status: "Order Placed" },
    { label: "Preparing", status: "Preparing" },
    { label: "Out for Delivery", status: "Out for Delivery" },
    { label: "Delivered", status: "Delivered" },
];

export default function OrderStatus() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const unsub = onSnapshot(doc(db, "orders", id), (docFn) => {
            if (docFn.exists()) {
                setOrder({ id: docFn.id, ...docFn.data() });
            } else {
                console.error("Order not found");
            }
            setLoading(false);
        });

        return () => unsub();
    }, [id]);

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
    // Fallback: if status isn't in list (e.g. Cancelled), handle gracefully or just show 0
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 flex flex-col">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12 w-full flex-grow">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
                    <div className="flex justify-between items-center mb-8 border-b dark:border-gray-700 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Placed on {new Date(order.date).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="block text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{order.total}</span>
                        </div>
                    </div>

                    {/* Stepper UI */}
                    <div className="relative mb-12">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-0"></div>
                        <div
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 transition-all duration-500 -z-0"
                            style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
                        ></div>

                        <div className="flex justify-between relative z-10 w-full">
                            {STEPS.map((step, index) => {
                                const isCompleted = index <= activeIndex;
                                const isCurrent = index === activeIndex;

                                return (
                                    <div key={index} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isCompleted
                                                ? "bg-green-500 text-white shadow-lg scale-110"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                                                }`}
                                        >
                                            {isCompleted ? "✓" : index + 1}
                                        </div>
                                        <span
                                            className={`mt-3 text-xs md:text-sm font-medium transition-colors duration-300 ${isCurrent
                                                ? "text-green-600 dark:text-green-400 font-bold"
                                                : isCompleted
                                                    ? "text-gray-900 dark:text-white"
                                                    : "text-gray-400 dark:text-gray-600"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-xl p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Items Ordered</h3>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold bg-white dark:bg-[#1e1e1e] px-2 py-1 rounded shadow-sm text-xs border dark:border-gray-700">
                                            {item.quantity}x
                                        </span>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {item.price}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Debug/Demo Control - In a real app this would be in an admin panel */}
                    <div className="mt-8 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <p className="text-xs text-center text-gray-400 uppercase mb-2">Hackathon Demo Control: Update Status</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {STEPS.map(s => (
                                <button
                                    key={s.status}
                                    disabled={order.status === s.status}
                                    onClick={async () => {
                                        // Quick hack to update status for demo purposes
                                        try {
                                            const { updateDoc } = await import("firebase/firestore");
                                            await updateDoc(doc(db, "orders", id), { status: s.status });
                                        } catch (e) {
                                            console.error(e);
                                            alert("Error updating status (Check console)");
                                        }
                                    }}
                                    className={`text-xs px-3 py-1 rounded border ${order.status === s.status ? 'bg-green-100 text-green-700 border-green-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'}`}
                                >
                                    Set: {s.label}
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
