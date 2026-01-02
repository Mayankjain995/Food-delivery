import React, { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ReviewModal({ restaurantId, onClose, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDoc(collection(db, "reviews"), {
                restaurantId: Number(restaurantId),
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
                rating,
                comment,
                createdAt: serverTimestamp()
            });
            if (onReviewAdded) onReviewAdded();
            onClose();
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-3xl focus:outline-none transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Experience
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none h-32 resize-none"
                                placeholder="Tell us what you liked..."
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Posting..." : "Post Review"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
