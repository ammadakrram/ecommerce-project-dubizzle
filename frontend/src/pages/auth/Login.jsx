import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Clear any existing errors before attempting login
    const result = await login(formData);
    if (result.success) {
      navigate("/");
    }
    // Error will be automatically set by the login function in authStore
  };

  return (
    <div className="min-h-screen auth-container">
      <div className="auth-content">
        {/* Left side - Branding */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <h1 className="auth-brand-title">SHOP.CO</h1>
            <p className="auth-brand-subtitle">
              Welcome back! Sign in to continue your fashion journey
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>
                <span>Access your personalized dashboard</span>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>
                <span>Track your orders and wishlist</span>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>
                <span>Exclusive member benefits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign in form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Welcome Back</h2>
              <p className="auth-form-subtitle">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="auth-error">
                <svg
                  className="auth-error-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="email" className="auth-form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password" className="auth-form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-form-button"
              >
                {loading ? (
                  <div className="auth-loading">
                    <div className="auth-spinner"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="auth-form-footer">
              <p className="auth-form-footer-text">
                Don't have an account?{" "}
                <Link to="/auth/signup" className="auth-form-link">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
