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
    <div className="h-screen w-full bg-white flex flex-col">
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full flex justify-center space-x-8 py-6 bg-white sticky top-0  z-10">
        {categories.map((category) => (
          <button
            key={category._id}
            className={`px-5 py-2 rounded-full text-lg font-medium transition ${
              selectedCategory?._id === category._id
                ? "bg-black text-white"
                : "text-black hover:text-gray-500"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
      <ul className="border-t border-gray-300">
          {subcategories.map((sub) => (
            <li
              key={sub._id}
              className="flex justify-between items-center py-5 px-10 border-b border-gray-300 cursor-pointer hover:bg-gray-100 transition"
            >
              <span className="flex items-center space-x-4 text-lg font-semibold">
                <img
                  src={sub.imageUrl || "https://via.placeholder.com/50"}
                  alt={sub.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <span>{sub.name}</span>
              </span>
              <span className="text-gray-500">→</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
