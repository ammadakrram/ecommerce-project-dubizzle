import { useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    // Simulate API call - replace with actual newsletter subscription logic
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        {/* Left side - Promotional text */}
        <div className="newsletter-content">
          <h2 className="newsletter-heading">
            STAY UP TO DATE ABOUT OUR LATEST OFFERS
          </h2>
        </div>

        {/* Right side - Form or Success message */}
        {isSubscribed ? (
          <div className="newsletter-success">
            <p className="newsletter-success-title">
              Thank you for subscribing!
            </p>
            <p className="newsletter-success-subtitle">
              You'll receive our latest offers and updates.
            </p>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="newsletter-input-container">
              <Mail className="newsletter-input-icon" size={20} />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="newsletter-button"
            >
              {loading ? "Subscribing..." : "Subscribe to Newsletter"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
