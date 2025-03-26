import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { getAllCollections, addToWishlist, addToCart, removeFromWishlist, removeFromCart } from "../../commonComponent/UserApi";
import { RiShare2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import QuickViewModal from "../productDetails/QuickViewModal";
import LoginModal from "../LoginModal";
import { ACCESS_TOKEN } from "../../commonComponent/Constant";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction } from "../../slice/wishlistSlice"; // Redux actions
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction } from "../../slice/cartSlice"; // Redux actions

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items); // Get wishlist items from Redux
  const cart = useSelector((state) => state.cart.items); // Get cart items from Redux

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

  const handleWishlistClick = (itemId) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === itemId);
    if (isInWishlist) {
      // If already in wishlist, remove it
      removeFromWishlist(itemId)
        .then(() => {
          dispatch(removeFromWishlistAction(itemId));
        })
        .catch((err) => console.error("Failed to remove from wishlist:", err));
    } else {
      // If not in wishlist, add it
      addToWishlist(itemId)
        .then(() => {
          dispatch(addToWishlistAction({ id: itemId }));
        })
        .catch((err) => console.error("Failed to add to wishlist:", err));
    }
  };

  const handleCartClick = (itemId) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    const isInCart = cart.some((cartItem) => cartItem.id === itemId);
    if (isInCart) {
      // If already in cart, remove it
      removeFromCart(itemId)
        .then(() => {
          dispatch(removeFromCartAction(itemId));
        })
        .catch((err) => console.error("Failed to remove from cart:", err));
    } else {
      // If not in cart, add it
      const quantity = 1; // Static quantity
      const desiredSize = "M"; // Static size
      addToCart(itemId, quantity, desiredSize)
        .then(() => {
          dispatch(addToCartAction({ id: itemId, quantity, desiredSize }));
        })
        .catch((err) => console.error("Failed to add to cart:", err));
    }
  };

  const handleImageClick = (itemId) => {
    console.log("Navigating to:", `/productDetails/${itemId}`);
    navigate(`/productDetails/${itemId}`);
  };

  return (
    <div className="relative w-full p-6">
      <h2 className="text-3xl font-light">COLLECTIONS</h2>
      <button className="border border-black px-4 py-2 mt-2 text-sm flex items-center">
        SEE ALL →
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 mt-4">Loading collections...</p>
      ) : (
        <div className="relative flex items-center mt-4">
          {/* <button
            className="absolute left-0 z-10 bg-black text-white p-2 rounded-full shadow-lg"
            onClick={() => sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })}
          >
            <MdChevronLeft size={24} />
          </button> */}

          <div
            ref={sliderRef}
            className="flex space-x-6 overflow-x-scroll scrollbar-hide py-6 px-10 scroll-smooth"
          >
            {collections.map((item) => {
              const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item._id);
              const isInCart = cart.some((cartItem) => cartItem.id === item._id);

              return (
                <div
                  key={item._id}
                  className="relative min-w-[220px] rounded-2xl overflow-hidden bg-white cursor-pointer"
                  onClick={() => handleImageClick(item._id)}
                >

                  <img
                    src={item.imageUrl || "https://via.placeholder.com/300"}
                    alt={item.name}
                    className="w-full h-80 object-cover rounded-2xl pointer-events-auto"
                  />


                  <div className="absolute top-4 right-4 flex flex-col space-y-2 pointer-events-none">
                    <button
                      className="bg-white p-3 rounded-full shadow-lg hover:scale-105 transition pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick(item._id);
                      }}
                    >
                      <FaHeart className={isInWishlist ? "text-black" : "text-gray-500"} />
                    </button>
                    <button
                      className="bg-white p-3 rounded-full shadow-lg hover:scale-105 transition pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemId(item._id);
                      }}
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
                    <button
                      className="bg-white p-3 rounded-full shadow-lg hover:scale-105 transition pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCartClick(item._id);
                      }}
                    >
                      <FaShoppingCart className={isInCart ? "text-black" : "text-gray-500"} />
                    </button>
                  </div>

                  <div className="flex flex-row">
                    <div className="p-4 text-start">
                      <h3 className="font-light text-lg">{item.name}</h3>
                      <p className="text-sm font-light text-gray-500">{item.description}</p>
                    </div>
                    <button
                      className="absolute bottom-4 right-4 bg-white p-3 rounded-full hover:scale-105 transition pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RiShare2Line />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <button
            className="absolute right-0 z-10 bg-black text-white p-2 rounded-full shadow-lg"
            onClick={() => sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })}
          >
            <MdChevronRight size={24} />
          </button> */}
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Collections;