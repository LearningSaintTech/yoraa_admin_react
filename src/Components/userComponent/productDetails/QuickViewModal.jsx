import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "../Carousel";
import { getItemDetailsById } from "../../commonComponent/UserApi";

const QuickViewModal = ({ isOpen, onClose, productId }) => {
  const itemId = productId;// Use prop if available, fallback to URL param
  console.log("Usiqqqqqqqqqqqqqqqqqqqqqqqqqng itemId:", itemId);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [qty, setQty] = useState(1); // Default quantity to 1
  const staticSizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    if (!itemId) {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }

    getItemDetailsById(itemId)
      .then((data) => {
        console.log("Fetched item details:", data);
        setItem(data);
        setActiveSize(data.sizes?.[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching item details:", err);
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [itemId]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null; // Prevents rendering when modal is closed

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="relative pt-8 sm:pt-0 bg-white w-[90%] max-w-5xl md:h-[78vh] h-[85vh] rounded-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-1 sm:right-1 top-0 sm:top-1 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:text-black"
        >
          <svg className="w-4 h-3" viewBox="0 0 14 14" fill="currentColor">
            <path
              d="M13 1L1 13M1 1L13 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Modal content */}
        <div className="grid grid-cols-1 gap-[168px] sm:gap-0 md:grid-cols-2 bg-gray-50 h-full overflow-y-auto">
          {/* Left side - Carousel */}
          <div className="md:h-full h-[42vh]">
            <Carousel data={item?.images || []} />
          </div>

          {/* Right side - Product details */}
          <div className="p-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="flex flex-col">
                <h2 className="font-semibold text-base mb-2">{item?.items?.name}</h2>
                <p className="text-sm text-gray-500">
                  Rs. {item?.items?.price.toLocaleString()}.00
                </p>

                {/* Size selection */}
                <div className="flex flex-col">
                  <div className="flex justify-between mx-1 mt-2 items-center">
                    <p className="text-xs text-gray-500">
                      Size: <span className="text-black ml-1">{activeSize}</span>
                    </p>
                  </div>
                  <div className="flex gap-1 text-gray-500 mt-1 text-xs">
                    {staticSizes.map((size) => (
                      <button
                        key={size}
                        className={`px-3 py-2 rounded ${
                          activeSize === size
                            ? "text-black font-medium underline"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity selection */}
                <div className="flex gap-2 items-center mt-4">
                  <div className="relative flex items-center mx-auto max-w-[132px] border-2 border-gray-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      className="bg-white hover:bg-gray-200 rounded-s-lg p-3 h-11"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={qty}
                      readOnly
                      className="bg-gray-50 border-x-0 text-center text-gray-900 text-sm w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setQty((prev) => prev + 1)}
                      className="bg-white hover:bg-gray-200 rounded-e-lg p-3 h-11"
                    >
                      +
                    </button>
                  </div>
                  <button className="w-full h-12 border text-sm rounded-md text-black hover:bg-black hover:text-white transition-all duration-300">
                    ADD TO CART
                  </button>
                </div>

                {/* Buy it now */}
                <button className="w-full h-12 text-sm rounded-md bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 mt-4">
                  BUY IT NOW
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
