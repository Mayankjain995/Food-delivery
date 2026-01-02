import { BrowserRouter, Routes, Route } from "react-router-dom";

<<<<<<< HEAD
function App() {
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

  if (loading) return <div className="text-center p-5 text-white">Loading...</div>;

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">Configuration Error</h1>
          <p className="mb-4">Firebase is not configured correctly.</p>
          <p className="text-sm text-gray-400">Please ensure environment variables (VITE_FIREBASE_API_KEY, etc.) are set in your Vercel project settings.</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/offers" element={user ? <Offers /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
        <Route path="/restaurant/:id" element={user ? <RestaurantDetails /> : <Navigate to="/login" />} />

        {/* Placeholder Routes for Footer Links */}
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
      </Routes>
    </Router>
  );
=======
function Home() {
  return <h2>Home Page</h2>;
>>>>>>> d8efc56531d9a17469a3d9893451e025cd67bd5b
}

function Login() {
  return <h2>Login Page</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
