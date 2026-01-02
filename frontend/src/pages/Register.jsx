import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function Register() {
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const saveUserToFirestore = async (user, additionalData = {}) => {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: name || user.displayName || email.split('@')[0],
            phone: phone || '',
            addresses: address ? [{ id: Date.now(), label: 'Home', fullAddress: address }] : [],
            createdAt: new Date().toISOString(),
            preferences: { isVeg: false, isJain: false },
            ...additionalData
        }, { merge: true });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await saveUserToFirestore(userCredential.user);
            showToast("Account Created Successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error registering:", error);
            setError(error.message);
            showToast("Registration Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await saveUserToFirestore(result.user);
            showToast("Logged in with Google!");
            navigate('/');
        } catch (error) {
            console.error("Google login failed:", error);
            showToast("Google Sign-in Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <h2 className="mt-6 text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Join Us
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        Delicious moments are just a sign-up away
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">or</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                    </div>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div className="space-y-4">
                            <input
                                type="text"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-100 dark:border-gray-800 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-100 dark:border-gray-800 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <input
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-100 dark:border-gray-800 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <input
                                    type="tel"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-100 dark:border-gray-800 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <textarea
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-100 dark:border-gray-800 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm resize-none h-24"
                                placeholder="Full Delivery Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-xl shadow-red-500/20 disabled:opacity-50 transform hover:-translate-y-1 transition-all uppercase tracking-widest"
                        >
                            {loading ? "Creating..." : "Sign Up"}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                        Already joined?{' '}
                        <Link to="/login" className="text-red-600 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
