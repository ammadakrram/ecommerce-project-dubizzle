import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay, FaGooglePay } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Brand Section */}
          <div className="footer-brand">
            <h2 className="footer-logo">SHOP.CO</h2>
            <p className="footer-tagline">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link">
                <Twitter size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <Instagram size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-nav">
            <div className="footer-column">
              <h3 className="footer-column-title">COMPANY</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/features">Features</Link>
                </li>
                <li>
                  <Link to="/works">Works</Link>
                </li>
                <li>
                  <Link to="/career">Career</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">HELP</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/support">Customer Support</Link>
                </li>
                <li>
                  <Link to="/delivery">Delivery Details</Link>
                </li>
                <li>
                  <Link to="/terms">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">FAQ</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/account">Account</Link>
                </li>
                <li>
                  <Link to="/deliveries">Manage Deliveries</Link>
                </li>
                <li>
                  <Link to="/orders">Orders</Link>
                </li>
                <li>
                  <Link to="/payments">Payments</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">RESOURCES</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/ebooks">Free eBooks</Link>
                </li>
                <li>
                  <Link to="/tutorial">Development Tutorial</Link>
                </li>
                <li>
                  <Link to="/blog">How to - Blog</Link>
                </li>
                <li>
                  <Link to="/youtube">Youtube Playlist</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>Shop.co © 2000-2023, All Rights Reserved</p>
          </div>
          <div className="footer-payments">
            <FaCcVisa size={40} className="footer-payment-icon" />
            <FaCcMastercard size={40} className="footer-payment-icon" />
            <FaCcPaypal size={40} className="footer-payment-icon" />
            <FaCcApplePay size={40} className="footer-payment-icon" />
            <FaGooglePay size={40} className="footer-payment-icon" />
          </div>
        </div>
      </div>
    </footer>
  );
}
