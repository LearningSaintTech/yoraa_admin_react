import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getItemsByFilter, addToWishlist, addToCart, removeFromWishlist, removeFromCart } from "../../Components/commonComponent/UserApi";
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction } from "../slice/wishlistSlice";
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction } from "../slice/cartSlice";
import { BsFillEyeFill } from "react-icons/bs";
import { RiHeartFill } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";
import QuickViewModal from "../../Components/userComponent/productDetails/QuickViewModal";
import SizeChartModal from "./SizeChartModal"; // Import the new SizeChartModal

const FilterScreen = () => {
  const [filters, setFilters] = useState({ sortBy: "", sizes: [], colors: [] });
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false); // State for SizeChartModal
  const [selectedItemId, setSelectedItemId] = useState(null); // Track the item being added to cart
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const cleanedFilters = Object.keys(filters).reduce((acc, key) => {
          const value = filters[key];
          if (Array.isArray(value) && value.length > 0) acc[key] = value;
          else if (typeof value === "string" && value.trim() !== "") acc[key] = value;
          return acc;
        }, {});
        const data = await getItemsByFilter({ filters: cleanedFilters, page, limit, searchText });
        setItems(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        setError(error.message);
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [filters, page, limit, searchText]);

  const handleFilterClick = (value, filterName) => {
    setFilters((prev) => {
      if (filterName === "sortBy") {
        return { ...prev, [filterName]: prev.sortBy === value ? "" : value };
      }
      const updatedFilter = prev[filterName].includes(value)
        ? prev[filterName].filter((item) => item !== value)
        : [...prev[filterName], value];
      return { ...prev, [filterName]: updatedFilter };
    });
  };

  const clearAllFilters = () => {
    setFilters({ sortBy: "", sizes: [], colors: [] });
    setSearchText("");
    setPage(1);
  };

  const handleSearchChange = (e) => setSearchText(e.target.value);
  const handlePageChange = (newPage) => setPage(newPage);
  const handleBack = () => navigate(-1);

  const handleWishlistClick = (itemId) => {
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

  const handleCartClick = (itemId) => {
    const isInCart = cart.some((cartItem) => cartItem.id === itemId);
    if (isInCart) {
      // If already in cart, remove it
      removeFromCart(itemId)
        .then(() => dispatch(removeFromCartAction(itemId)))
        .catch((err) => console.error("Failed to remove from cart:", err));
    } else {
      // Open SizeChartModal to select size before adding to cart
      setSelectedItemId(itemId);
      setIsSizeChartOpen(true);
    }
  };

  const handleAddToCartWithSize = (selectedSize) => {
    if (selectedItemId) {
      const quantity = 1;
      addToCart(selectedItemId, quantity, selectedSize)
        .then(() => dispatch(addToCartAction({ id: selectedItemId, quantity, desiredSize: selectedSize })))
        .catch((err) => console.error("Failed to add to cart:", err));
    }
  };

  const handleQuickViewClick = (itemId) => {
    console.log("itemId", itemId);
    setSelectedProductId(itemId);
    setIsQuickViewOpen(true);
  };

  const handleImageClick = (itemId) => {
    navigate(`/productDetails/${itemId}`);
  };

  const colorOptions = [
    { name: "Animal Print", bgClass: "bg-gradient-to-r from-gray-500 via-brown-500 to-gray-700" },
    { name: "Red", bgClass: "bg-red-500" },
    { name: "Blue", bgClass: "bg-blue-500" },
    { name: "Green", bgClass: "bg-green-500" },
    { name: "Yellow", bgClass: "bg-yellow-500" },
    { name: "Black", bgClass: "bg-black" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 mr-9 py-2 flex items-center border border-black text-black font-light rounded-none hover:bg-black hover:text-white transition-colors duration-500 ease-in-out shadow-sm group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="20"
            viewBox="0 0 35 29"
            fill="none"
            className="group-hover:stroke-white stroke-black transition-colors duration-500"
          >
            <path d="M5.39795 27.6955V17.4324" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M5.39795 11.5677V1.3045" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M17.1279 27.6954V14.4999" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M17.1279 8.63533V1.3045" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M28.8569 27.6954V20.3646" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M28.8569 14.5V1.3045" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M0.999756 17.4324H9.79675" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M12.7288 8.63544H21.5258" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M24.4585 20.3646H33.2555" strokeWidth="1.71053" strokeLinecap="square" strokeLinejoin="round" />
          </svg>
          <span className="ml-2">Filter</span>
        </button>
        <div className="relative w-72">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search for elegance..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-700 placeholder-gray-400 transition-all duration-300"
          />
        </div>
      </header>

      {/* Filter Modal (Slide from Left) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className={`w-80 bg-white h-full shadow-lg transform transition-transform duration-500 ease-in-out ${
              isModalOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-light uppercase tracking-wider text-gray-800">FILTER</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex">
                  <div className="w-1/2">
                    <h3 className="text-sm font-light uppercase tracking-wider text-gray-500">Sort By</h3>
                  </div>
                  <div className="w-1/2">
                    <ul className="space-y-4">
                      {[
                        { name: "ascendingPrice", label: "ASCENDING PRICE" },
                        { name: "descendingPrice", label: "DESCENDING PRICE" },
                        { name: "new", label: "NEW" },
                      ].map((sortOption) => (
                        <li key={sortOption.name} className="flex items-center space-x-2">
                          <span
                            onClick={() => handleFilterClick(sortOption.name, "sortBy")}
                            className={`text-sm uppercase tracking-wide cursor-pointer transition-colors duration-200 ${
                              filters.sortBy === sortOption.name
                                ? "text-black font-normal"
                                : "text-gray-400 font-light hover:text-black"
                            }`}
                          >
                            {sortOption.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2">
                    <h3 className="text-sm font-light uppercase tracking-wider text-gray-500">Size</h3>
                  </div>
                  <div className="w-1/2">
                    <ul className="space-y-4">
                      {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <li key={size} className="flex items-center space-x-2">
                          <span
                            onClick={() => handleFilterClick(size, "sizes")}
                            className={`text-sm uppercase tracking-wide cursor-pointer transition-colors duration-200 ${
                              filters.sizes.includes(size)
                                ? "text-black font-normal"
                                : "text-gray-400 font-light hover:text-black"
                            }`}
                          >
                            {size}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2">
                    <h3 className="text-sm font-light uppercase tracking-wider text-gray-500">Colour</h3>
                  </div>
                  <div className="w-1/2">
                    <ul className="space-y-4">
                      {colorOptions.map((color) => (
                        <li key={color.name} className="flex items-center space-x-2">
                          <span className={`w-4 h-4 ${color.bgClass}`}></span>
                          <span
                            onClick={() => handleFilterClick(color.name, "colors")}
                            className={`text-sm uppercase tracking-wide cursor-pointer transition-colors duration-200 flex items-center space-x-2 ${
                              filters.colors.includes(color.name)
                                ? "text-black font-normal"
                                : "text-gray-400 font-light hover:text-black"
                            }`}
                          >
                            <span>{color.name}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 bg-gray-200 text-gray-700 font-light uppercase tracking-wide hover:bg-gray-300 transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-8 px-6">
        {loading && <p className="text-center text-gray-500 py-12 text-lg italic">Loading treasures...</p>}
        {error && <p className="text-red-600 text-center py-12 text-lg font-light">{error}</p>}
        {!loading && !error && (
          <div>
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-12 text-lg italic">No treasures found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {items.map((item) => {
                  const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item._id);
                  const isInCart = cart.some((cartItem) => cartItem.id === item._id);

                  return (
                    <div key={item._id} className="rounded-2xl overflow-hidden relative group">
                      <div className="relative">
                        <img
                          src={item.imageUrl || "https://via.placeholder.com/300"}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                          onClick={() => handleImageClick(item._id)}
                        />
                        {item.label === "new" && (
                          <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-light tracking-wide">
                            NEW
                          </span>
                        )}
                        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-full group-hover:translate-x-0">
                          <button
                            onClick={() => handleWishlistClick(item._id)}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-all duration-300"
                          >
                            <RiHeartFill className={`text-lg ${isInWishlist ? "text-amber-500" : "text-gray-600"}`} />
                          </button>
                          <button
                            onClick={() => handleQuickViewClick(item._id)}
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
            )}
            <div className="mt-10 flex justify-center space-x-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                    page === pageNum
                      ? "bg-amber-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-amber-100 hover:text-amber-800"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QuickViewModal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        productId={selectedProductId}
      />

      {/* SizeChartModal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        itemId={selectedItemId}
        onConfirm={handleAddToCartWithSize}
      />
    </div>
  );
};

export default FilterScreen;