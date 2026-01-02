import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ComingSoon from "./pages/ComingSoon";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Offers from "./pages/Offers";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import OrderStatus from "./pages/OrderStatus";
import RestaurantDetails from "./pages/RestaurantDetails";
import LoadingSpinner from "./components/LoadingSpinner";
import NotFound from "./pages/NotFound";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth is not initialized.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">Configuration Error</h1>
          <p className="mb-4">Firebase is not configured correctly.</p>
          <p className="text-sm text-gray-400">
            Please ensure environment variables (VITE_FIREBASE_API_KEY, etc.) are set in your Vercel project settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/offers" element={user ? <Offers /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/order-status/:id" element={user ? <OrderStatus /> : <Navigate to="/login" />} />
          <Route path="/restaurant/:id" element={user ? <RestaurantDetails /> : <Navigate to="/login" />} />

          <Route path="/about" element={<ComingSoon />} />
          <Route path="/careers" element={<ComingSoon />} />
          <Route path="/team" element={<ComingSoon />} />
          <Route path="/blog" element={<ComingSoon />} />
          <Route path="/help" element={<ComingSoon />} />
          <Route path="/partner" element={<ComingSoon />} />
          <Route path="/ride" element={<ComingSoon />} />
          <Route path="/terms" element={<ComingSoon />} />
          <Route path="/privacy" element={<ComingSoon />} />
          <Route path="/cookie" element={<ComingSoon />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
