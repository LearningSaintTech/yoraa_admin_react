import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItemDetailsById } from "../../commonComponent/UserApi"; // Import the function
import { ACCESS_TOKEN, USER_DATA } from '../../commonComponent/Constant';

const ProductDetails = () => {
  const { itemId } = useParams(); // Get itemId from URL params
  const [item, setItem] = useState(null); // State to store item details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itemId) return;
    console.log("Stored ACCESS_TOKEN:", localStorage.getItem(ACCESS_TOKEN));

    // Fetch item details
    getItemDetailsById(itemId)
      .then((data) => {
        console.log("Fetched item details:", data);
        setItem(data); // Set the retrieved item data
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching item details:", err);
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [itemId]);

  if (loading) return <p className="text-gray-500 p-6">Loading product details...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!item) return <p className="text-gray-500 p-6">No product found.</p>;

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-white rounded-lg shadow-lg">
      {/* Image Gallery */}
      <div className="grid grid-cols-2 gap-2">
        {item.images?.map((img, index) => (
          <img key={index} src={img} alt={`Product Image ${index + 1}`} className="rounded-lg w-full" />
        ))}
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h2 className="text-xl font-bold uppercase">{item.items.name}</h2>
        <p className="text-gray-600 mt-1">Rs. {item.items.price} (All Taxes Included)</p>

        {/* Size Selection */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Size: <span className="font-semibold text-black">{item.defaultSize || "N/A"}</span>
          </p>
          <div className="flex gap-2 mt-2">
            {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
              <button
                key={size}
                className={`px-3 py-1 border rounded ${size === item.defaultSize ? "border-black font-bold" : "border-gray-300 text-gray-500"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="border px-4 py-2 rounded hover:bg-gray-100">Details</button>
          <button className="border px-4 py-2 rounded hover:bg-gray-100">Size Chart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
