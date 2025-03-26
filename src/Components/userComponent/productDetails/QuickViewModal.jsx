import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemDetailsById, addToWishlist, removeFromWishlist, addToCart, removeFromCart } from "../../commonComponent/UserApi";
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction } from "../../slice/wishlistSlice";
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction } from "../../slice/cartSlice";
import Carousel from "../Carousel";
import { FaHeart, FaShoppingCart } from "react-icons/fa"; // Importing wishlist and cart icons
import SizeChartModal from "../SizeChartModal"; // Import SizeChartModal

// DetailsModal Component
const DetailsModal = ({ isOpen, onClose, itemDetails }) => {
  const [openSections, setOpenSections] = useState({
    description: false,
    manufacturer: false,
    shipping: true, // Initially open as per the image
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-2xl p-6 rounded-lg overflow-y-auto max-h-[80vh] relative">
        {/* Enhanced Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black transition-all duration-200"
          aria-label="Close details modal"
        >
          ✕
        </button>
        <div className="text-gray-600 mt-8 space-y-3">
          {/* Description & Returns */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("description")}
              className="w-full text-left py-2 flex justify-between items-center"
            >
              <span className="text-sm font-medium">Description & Returns</span>
              <span>{openSections.description ? "−" : "+"}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSections.description ? "max-h-96" : "max-h-0"
              }`}
            >
              {openSections.description && itemDetails?.descriptionAndReturns && (
                <p className="text-sm p-2">{itemDetails.descriptionAndReturns}</p>
              )}
            </div>
          </div>

          {/* Manufacturer Details */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("manufacturer")}
              className="w-full text-left py-2 flex justify-between items-center"
            >
              <span className="text-sm font-medium">Manufacturer Details</span>
              <span>{openSections.manufacturer ? "−" : "+"}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSections.manufacturer ? "max-h-96" : "max-h-0"
              }`}
            >
              {openSections.manufacturer && itemDetails?.manufacturerDetails && (
                <div className="text-sm p-2">
                  <p>Name: {itemDetails.manufacturerDetails.name || "N/A"}</p>
                  <p>Address: {itemDetails.manufacturerDetails.address || "N/A"}</p>
                  <p>Country of Origin: {itemDetails.manufacturerDetails.countryOfOrigin || "N/A"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping, Returns and Exchanges */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("shipping")}
              className="w-full text-left py-2 flex justify-between items-center"
            >
              <span className="text-sm font-medium">Shipping, Returns and Exchanges</span>
              <span>{openSections.shipping ? "−" : "+"}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSections.shipping ? "max-h-96" : "max-h-0"
              }`}
            >
              {openSections.shipping && (
                <div className="text-sm p-2">
                  <h4 className="font-medium">Shipping -</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>50 Rs shipping charges will be charged on Orders Below 2500Rs</li>
                    <li>100Rs COD(Cash on Delivery) Charges will be charged on COD Orders Below 3000Rs</li>
                    <li>For international orders, customs duties may be levied at the time of delivery in certain countries.</li>
                    <li>Product are shipped from our warehouse within 4 working days.</li>
                  </ul>
                  {itemDetails?.shippingAndReturns?.returnPolicy && (
                    <div className="mt-2">
                      <h4 className="font-medium">Return Policy:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {itemDetails.shippingAndReturns.returnPolicy.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickViewModal = ({ isOpen, onClose, productId }) => {
  const itemId = productId;
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSize, setActiveSize] = useState("XS"); // Default size
  const [qty, setQty] = useState(1);
  const staticSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"]; // All possible sizes
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State for details modal
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false); // State for SizeChartModal

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (!itemId || itemId === "undefined") {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getItemDetailsById(itemId)
      .then((data) => {
        if (!data || !data.items || !data.items._id) {
          setError("Invalid item data structure.");
          setLoading(false);
          return;
        }

        setItemDetails(data);
        // Set the default active size to the first available size
        const availableSize = staticSizes.find(size => {
          const sizeData = data.sizes?.find(s => s.size === size);
          return sizeData && sizeData.stock > 0;
        });
        setActiveSize(availableSize || "XS"); // Fallback to XS if no available size
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [itemId]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleWishlistClick = () => {
    const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === itemId);
    if (isInWishlist) {
      removeFromWishlist(itemId)
        .then(() => dispatch(removeFromWishlistAction(itemId)))
        .catch((err) => console.error("Failed to remove from wishlist:", err));
    } else {
      addToWishlist(itemId)
        .then(() => dispatch(addToWishlistAction({ id: itemId })))
        .catch((err) => console.error("Failed to add to wishlist:", err));
    }
  };

  const handleCartClick = () => {
    const isInCart = cart.some((cartItem) => cartItem.id === itemId);
    if (isInCart) {
      // If already in cart, remove it
      removeFromCart(itemId)
        .then(() => dispatch(removeFromCartAction(itemId)))
        .catch((err) => console.error("Failed to remove from cart:", err));
    } else {
      // Open SizeChartModal to select size before adding to cart
      setIsSizeChartOpen(true);
    }
  };

  const handleAddToCartWithSize = (selectedSize) => {
    if (itemId) {
      addToCart(itemId, qty, selectedSize)
        .then(() => dispatch(addToCartAction({ id: itemId, quantity: qty, desiredSize: selectedSize })))
        .catch((err) => console.error("Failed to add to cart:", err));
    }
  };

  const openDetailsModal = () => {
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  // Check if a size is available (present in sizes array and stock > 0)
  const isSizeAvailable = (size) => {
    const sizeData = itemDetails?.sizes?.find(s => s.size === size);
    return sizeData && sizeData.stock > 0;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="relative pt-8 sm:pt-0 bg-white w-[90%] max-w-5xl md:h-[78vh] h-[85vh] rounded-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black transition-all duration-200"
          aria-label="Close quick view modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-gray-50 h-full overflow-y-auto">
          {/* Left Side - Image Carousel */}
          <div className="md:h-full h-[42vh]">
            <Carousel data={itemDetails?.images || []} />
          </div>

          {/* Right Side - Product Details */}
          <div className="p-9 flex flex-col">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                {/* Product Name & Price with Icons */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-bold text-lg">{itemDetails?.items?.name || "N/A"}</h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleWishlistClick}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-all duration-300"
                    >
                      <FaHeart
                        className={`text-lg ${
                          wishlist.some((wishlistItem) => wishlistItem.id === itemId)
                            ? "text-amber-500"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleCartClick}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-all duration-300"
                    >
                      <FaShoppingCart
                        className={`text-lg ${
                          cart.some((cartItem) => cartItem.id === itemId)
                            ? "text-amber-500"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Rs. {itemDetails?.items?.price?.toLocaleString() || "0"}.00 (ALL TAXES INCLUDED)
                </p>
                <div className="bg-gray-400 h-[1px] my-3"></div>

                {/* Size Selection */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">SIZE: {activeSize}</p>
                  <div className="flex gap-3 text-xs">
                    {staticSizes.map((size) => {
                      const available = isSizeAvailable(size);
                      return (
                        <button
                          key={size}
                          onClick={() => available && setActiveSize(size)}
                          disabled={!available}
                          className={`px-3 py-1 ${
                            activeSize === size && available
                              ? "text-black font-medium underline"
                              : available
                              ? "text-gray-500 hover:text-black hover:underline"
                              : "text-gray-400 line-through cursor-not-allowed"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Details Button */}
                <div className="flex flex-row justify-between items-start mb-4">
                  <button
                    onClick={openDetailsModal}
                    className="underline text-start text-black text-xs w-32"
                  >
                    DETAILS
                  </button>
                </div>

                {/* Quantity Selection - Aligned to Start */}
                <div className="flex justify-start mb-4">
                  <div className="relative flex items-center max-w-[120px] border border-gray-300 rounded-md overflow-hidden">
                    {/* Decrease Button */}
                    <button
                      type="button"
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 text-sm font-medium transition-all duration-200"
                    >
                      −
                    </button>

                    {/* Quantity Input */}
                    <input
                      type="number"
                      value={qty}
                      readOnly
                      className="w-10 text-center text-gray-900 text-sm border-x border-gray-300 focus:outline-none"
                    />

                    {/* Increase Button */}
                    <button
                      type="button"
                      onClick={() => setQty((prev) => prev + 1)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 text-sm font-medium transition-all duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buy Now Button */}
                <button className="w-full h-12 text-sm rounded-md bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 mt-4">
                  BUY IT NOW
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        itemDetails={itemDetails}
      />

      {/* SizeChartModal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        itemId={itemId}
        onConfirm={handleAddToCartWithSize}
      />
    </div>
  );
};

export default QuickViewModal;