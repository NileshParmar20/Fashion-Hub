import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// src/components/UIComponents.jsx
// Reusable UI components for shopping pages

import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/utils/helpers";

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex justify-center items-center h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37] mx-auto mb-4"></div>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  </div>
);

/**
 * Error Alert Component
 */
export const ErrorAlert = ({ message, onDismiss }) => (
  <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 text-red-400 mb-6 flex justify-between items-center">
    <span>{message}</span>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-300 font-bold"
      >
        ×
      </button>
    )}
  </div>
);

/**
 * Success Notification Component
 */
export const SuccessNotification = ({ message }) => (
  <div className="fixed top-20 right-4 px-6 py-3 rounded-lg z-50 animate-pulse bg-green-500 text-white">
    {message}
  </div>
);

/**
 * Empty State Component
 */
export const EmptyState = ({
  title = "No items found",
  description = "Try adjusting your filters or search",
  buttonText = "Browse Products",
  buttonAction,
}) => (
  <div className="flex flex-col items-center justify-center h-96 text-center">
    <p className="text-3xl text-gray-400 mb-6">{title}</p>
    {description && <p className="text-gray-500 mb-6">{description}</p>}
    {buttonAction && (
      <button
        onClick={buttonAction}
        className="bg-[#D4AF37] text-black px-8 py-3 rounded font-semibold hover:bg-[#e5c158] transition-colors"
      >
        {buttonText}
      </button>
    )}
  </div>
);

/**
 * Price Badge Component
 */
export const PriceBadge = ({ price, original = null }) => (
  <div className="flex items-center gap-2">
    <span className="text-2xl font-bold text-[#D4AF37]">
      ₹{price?.toLocaleString() || 0}
    </span>
    {original && (
      <span className="text-sm text-gray-500 line-through">
        ₹{original?.toLocaleString()}
      </span>
    )}
  </div>
);

/**
 * Stock Badge Component
 */
export const StockBadge = ({ stock }) => {
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock < 5;

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        isInStock
          ? isLowStock
            ? "bg-yellow-500 text-black"
            : "bg-[#D4AF37] text-black"
          : "bg-red-500 text-white"
      }`}
    >
      {isInStock ? `In Stock (${stock})` : "Out of Stock"}
    </div>
  );
};

/**
 * Rating Component
 */
export const Rating = ({ rating = 5, reviews = 0, interactive = false }) => (
  <div className="flex items-center gap-2">
    <div className="flex text-[#D4AF37]">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={interactive && i < rating ? "cursor-pointer" : ""}
        >
          ★
        </span>
      ))}
    </div>
    {reviews > 0 && (
      <span className="text-gray-400 text-sm">({reviews} reviews)</span>
    )}
  </div>
);

/**
 * Quantity Selector Component
 */
export const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg",
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`bg-[#2a2a2a] border border-[#374151] rounded text-[#D4AF37] hover:bg-[#3a3a3a] transition-colors ${sizeClasses[size]}`}
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value) || min;
          onChange(Math.max(min, Math.min(max, val)));
        }}
        min={min}
        max={max}
        className={`w-16 bg-[#1a1a1a] border border-[#374151] rounded text-center text-white focus:outline-none focus:border-[#D4AF37] ${sizeClasses[size]}`}
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`bg-[#2a2a2a] border border-[#374151] rounded text-[#D4AF37] hover:bg-[#3a3a3a] transition-colors ${sizeClasses[size]}`}
      >
        +
      </button>
    </div>
  );
};

/**
 * Product Card Component
 */
export const ProductCard = ({ product, onAddToCart, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#374151] hover:border-[#D4AF37] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#D4AF37]/20"
    >
      {/* Product Image */}
      <div className="relative bg-[#2a2a2a] h-48 flex items-center justify-center overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-500 text-sm">No Image</div>
        )}
        <div className="absolute top-3 right-3">
          <StockBadge stock={product.stock || 0} />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-[#D4AF37] mb-2">
          {product.category?.name || "Uncategorized"}
        </p>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <PriceBadge price={product.price} />
          {product.stock > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart && onAddToCart();
              }}
              className="bg-[#D4AF37] text-black px-3 py-2 rounded font-semibold text-sm hover:bg-[#e5c158] transition-colors active:scale-95"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Button Component
 */
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary:
      "bg-[#D4AF37] text-black hover:bg-[#e5c158] disabled:bg-gray-600",
    secondary:
      "bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",
    danger:
      "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-800",
    outline:
      "bg-transparent border-2 border-gray-400 text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37]",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-2",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-semibold rounded-lg transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {loading ? "Processing..." : children}
    </button>
  );
};

/**
 * Input Component
 */
export const Input = ({
  label,
  error,
  required = false,
  ...inputProps
}) => (
  <div>
    {label && (
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      {...inputProps}
      className={`w-full px-4 py-2 bg-[#0F0F0F] border rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${
        error ? "border-red-500" : "border-[#374151]"
      }`}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

/**
 * Breadcrumb Component
 */
export const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-2 text-[#D4AF37] mb-6">
    {items.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        {index > 0 && <span className="text-gray-400">/</span>}
        {item.href ? (
          <a href={item.href} className="hover:text-white transition-colors">
            {item.label}
          </a>
        ) : (
          <span className="text-gray-400">{item.label}</span>
        )}
      </div>
    ))}
  </nav>
);

/**
 * Filter Badge Component
 */
export const FilterBadge = ({ label, onRemove }) => (
  <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#D4AF37] px-3 py-1 rounded-full text-sm text-white">
    {label}
    {onRemove && (
      <button
        onClick={onRemove}
        className="text-[#D4AF37] hover:text-white font-bold text-lg"
      >
        ×
      </button>
    )}
  </div>
);

/**
 * Section Container Component
 */
export const Section = ({
  title,
  subtitle,
  children,
  className = "",
}) => (
  <section className={`mb-12 ${className}`}>
    {title && (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">{title}</h2>
        {subtitle && <p className="text-gray-400">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

/**
 * Info Box Component
 */
export const InfoBox = ({
  title,
  message,
  type = "info",
  icon,
}) => {
  const typeClasses = {
    info: "bg-blue-900 bg-opacity-20 border-blue-500 text-blue-400",
    success: "bg-green-900 bg-opacity-20 border-green-500 text-green-400",
    warning: "bg-yellow-900 bg-opacity-20 border-yellow-500 text-yellow-400",
    error: "bg-red-900 bg-opacity-20 border-red-500 text-red-400",
  };

  return (
    <div className={`border rounded-lg p-4 ${typeClasses[type]}`}>
      {title && <p className="font-semibold mb-1">{title}</p>}
      <div className="flex items-start gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default {
  LoadingSpinner,
  ErrorAlert,
  SuccessNotification,
  EmptyState,
  PriceBadge,
  StockBadge,
  Rating,
  QuantitySelector,
  ProductCard,
  Button,
  Input,
  Breadcrumb,
  FilterBadge,
  Section,
  InfoBox,
};