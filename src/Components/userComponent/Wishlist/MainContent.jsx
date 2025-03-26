import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useDispatch, useSelector } from "react-redux";
import { getAllWhishlist, addToWishlist, addToCart, removeFromWishlist, removeFromCart } from "../../commonComponent/UserApi";
import { BsFillEyeFill } from "react-icons/bs";
import { RiHeartFill } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";
import { GoUpload } from "react-icons/go";
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction } from "../../slice/wishlistSlice"; // Redux actions
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction } from "../../slice/cartSlice"; // Redux actions

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const wishlist = useSelector((state) => state.wishlist.items); // Get wishlist items from Redux
  const cart = useSelector((state) => state.cart.items); // Get cart items from Redux

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = () => {
    setLoading(true);
    getAllWhishlist()
      .then((response) => {
        // Extract the wishlist array from response.data.wishlist and map to the item objects
        const items = response.data.wishlist.map((entry) => entry.item) || [];
        setWishlistItems(items);
      })
      .catch((err) => {
        console.error("Failed to load wishlist:", err);
        setError("Failed to load wishlist");
      })
      .finally(() => setLoading(false));
  };

  const handleWishlistClick = (itemId) => {
    const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === itemId);
    if (isInWishlist) {
      // If already in wishlist, remove it
      removeFromWishlist(itemId)
        .then(() => {
          dispatch(removeFromWishlistAction(itemId));
          // Update local state to reflect removal
          setWishlistItems(wishlistItems.filter((item) => item._id !== itemId));
        })
        .catch((err) => console.error("Failed to remove from wishlist:", err));
    } else {
      // If not in wishlist, add it
      addToWishlist(itemId)
        .then(() => {
          dispatch(addToWishlistAction({ id: itemId }));
          // Refetch wishlist to ensure UI sync
          fetchWishlist();
        })
        .catch((err) => console.error("Failed to add to wishlist:", err));
    }
  };

  const handleCartClick = (itemId) => {
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

  // Function to handle image click and navigate to ProductDetails
  const handleImageClick = (itemId) => {
    navigate(`/productDetails/${itemId}`); // Navigate to the ProductDetails page
  };

  return (
    <div className="flex flex-col pt-4">
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {wishlistItems.length === 0 && !loading && !error && (
        <p className="text-gray-500">Your wishlist is empty.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-xl mx-auto mt-6">
        {wishlistItems.map((item) => {
          const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item._id);
          const isInCart = cart.some((cartItem) => cartItem.id === item._id);
          const isNew = item.label === "new"; // Assuming 'label' indicates new items
          const isOutOfStock = item.stock === 0; // Assuming 'stock' indicates out of stock

          return (
            <div key={item._id} className="rounded-2xl overflow-hidden relative group">
              {/* Image Section */}
              <div className="relative">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => handleImageClick(item._id)} // Navigate to ProductDetails on image click
                />
                {item.label === "new" && (
                  <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium tracking-wide">
                    NEW
                  </span>
                )}
                {/* Action Buttons (Wishlist, View, Cart) */}
                <div className="absolute bottom-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-full group-hover:translate-x-0">
                  <button
                    onClick={() => handleWishlistClick(item._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-all duration-300"
                  >
                    <RiHeartFill className={`text-lg ${isInWishlist ? "text-amber-500" : "text-gray-600"}`} />
                  </button>
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-all duration-300"
                  >
                    <BsFillEyeFill className="text-lg text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleCartClick(item._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-all duration-300"
                  >
                    <CiShoppingCart className={`text-lg ${isInCart ? "text-amber-500" : "text-gray-600"}`} />
                  </button>
                </div>
              </div>

              {/* Text Section */}
              <div className="p-4 text-start">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  {item.name || "MOHAN"}
                </h3>
                <p className="text-sm font-light text-[#AFAFAF] mt-1">
                  Rs. ₹{item.price || "1120"} (ALL TAXES INCLUDED)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;