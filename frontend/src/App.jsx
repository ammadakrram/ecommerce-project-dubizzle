import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuthStore from "./store/authStore";

// Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Search from "./pages/Search";

// Layout
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/auth/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - No Header/Footer */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/signup"
          element={<Navigate to="/auth/signup" replace />}
        />

        {/* Main App Routes - With Header/Footer */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/search" element={<Search />} />

                  {/* Protected Routes */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
