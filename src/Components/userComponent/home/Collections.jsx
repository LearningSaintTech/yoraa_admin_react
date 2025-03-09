import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { getAllCollections } from "../../commonComponent/UserApi";
import { RiShare2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import QuickViewModal from "../productDetails/QuickViewModal";
import LoginModal from "../LoginModal"; // Import the login modal
import { ACCESS_TOKEN } from "../../commonComponent/Constant";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await getAllCollections();
      setCollections(response.items);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setError("Failed to load collections.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (actionType, itemId) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsLoginModalOpen(true);
    } else {
      if (actionType === "wishlist") {
        navigate(`/wishlist`);
      } else if (actionType === "cart") {
        navigate(`/cart`);
      }
    }
  };

  return (
    <div className="relative w-full p-6">
      <h2 className="text-3xl font-bold">COLLECTIONS</h2>
      <button className="border border-black px-4 py-2 mt-2 text-sm flex items-center">
        SEE ALL →
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 mt-4">Loading collections...</p>
      ) : (
        <div className="relative flex items-center mt-4">
          <button
            className="absolute left-0 z-10 bg-black text-white p-2 rounded-full shadow-lg"
            onClick={() => sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })}
          >
            <MdChevronLeft size={24} />
          </button>

          <div
            ref={sliderRef}
            className="flex space-x-6 overflow-x-scroll scrollbar-hide py-6 px-10 scroll-smooth"
          >
            {collections.map((item) => (
              <div
                key={item.id}
                className="relative min-w-[280px] rounded-xl overflow-x-hidden bg-white"
              >
                {item.isNew && (
                  <span className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs font-bold rounded">
                    NEW
                  </span>
                )}
                <img
                  src={item.imageUrl || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="w-full h-80 object-cover"
                />

                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  {/* Wishlist Button */}
                  <button
                    className="bg-white p-3 rounded-full shadow-lg hover:scale-105 transition"
                    onClick={() => handleAction("wishlist", item._id)}
                  >
                    <FaHeart className="text-black" />
                  </button>

                  {/* Quick View Button */}
                  <button
                    className="bg-white p-3 rounded-full shadow-lg hover:scale-105 transition"
                    onClick={() => setSelectedItemId(item._id)}
                  >
                    <FaEye className="text-black" />
                  </button>

                  {selectedItemId === item._id && (
                    <QuickViewModal
                      isOpen={!!selectedItemId}
                      onClose={() => setSelectedItemId(null)}
                      productId={selectedItemId}
                    />
                  )}

                  {/* Cart Button */}
                  <button
                    className="bg-white p-3 rounded-full shadow-lg hover:scale-105 transition"
                    onClick={() => handleAction("cart", item._id)}
                  >
                    <FaShoppingCart className="text-black" />
                  </button>
                </div>

                <div className="flex flex-row">
                  <div className="p-4 text-start">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>

                  <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full hover:scale-105 transition">
                    <RiShare2Line />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="absolute right-0 z-10 bg-black text-white p-2 rounded-full shadow-lg"
            onClick={() => sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })}
          >
            <MdChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Collections;
