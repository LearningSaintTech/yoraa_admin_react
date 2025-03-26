import React, { useState, useEffect } from "react";
import { getAllCategories, getAllSubCategories } from "../../commonComponent/UserApi"; 

const Category = () => {
  const [categories, setCategories] = useState([]); 
  const [subcategories, setSubcategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching categories...");
    getAllCategories()
      .then((response) => {
        console.log("API Response (Categories):", response.data);
        setCategories(response.data);

        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]); 
          fetchSubcategories(response.data[0]._id);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchSubcategories = (categoryId) => {
    console.log(`Fetching subcategories for category ID: ${categoryId}...`);
    setLoading(true);

    getAllSubCategories(categoryId)
      .then((response) => {
        console.log(`API Response (Subcategories for ${categoryId}):`, response.data);
        setSubcategories(response.data);
      })
      .catch((err) => {
        console.error("Error fetching subcategories:", err);
        setError("Failed to load subcategories");
      })
      .finally(() => setLoading(false));
  };

  const handleCategoryClick = (category) => {
    console.log("Selected Category:", category);
    setSelectedCategory(category);
    fetchSubcategories(category._id);
  };

  return (
    <div className="w-full bg-[#F5F5F5]  flex flex-col">
      {/* Loading and Error States */}
      {loading && <p className="text-gray-500 text-center py-4">Loading...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {/* Category Buttons */}
      <div className="w-full flex justify-center space-x-6 py-6 bg-[#F5F5F5] sticky top-0 z-10">
        {categories.map((category) => (
          <button
            key={category._id}
            className={`px-6 py-2 rounded-full text-lg font-light transition ${
              selectedCategory?._id === category._id
                ? "bg-white text-blacks"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-x-auto scrollbar-hide px-4">
  <div className="flex space-x-4 py-4">
    {subcategories.map((sub) => (
      <div
        key={sub._id}
        className="flex-none w-64 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
      >
        {/* Image with Full Display */}
        <div className="relative w-full h-96">
          <img
            src={sub.imageUrl || "https://via.placeholder.com/300"}
            alt={sub.name}
            className="w-full h-full object-cover rounded-xl"
          />
          {/* Overlay Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-white  text-black text-lg font-light py-2 rounded-full transition hover:bg-gray-200 shadow-md">
              {sub.name}
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


    </div>
  );
};

export default Category;