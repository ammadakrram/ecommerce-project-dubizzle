import { X } from "lucide-react";
import SearchBar from "./SearchBar";
import { useEffect } from "react";

/**
 * ==========================================
 * MOBILE SEARCH MODAL COMPONENT
 * ==========================================
 * Full-screen search modal for mobile devices
 * Features:
 * - Full-screen overlay
 * - Auto-focus on input
 * - Close on backdrop click
 * - Escape key to close
 */
export default function MobileSearchModal({ isOpen, onClose }) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent background scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Search Products</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <SearchBar placeholder="Search for products..." />
        </div>
      </div>
    </div>
  );
}
