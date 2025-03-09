import React, { useState, useEffect } from "react";
import { getAllCategories, getAllSubCategories, getAllItemsBySubCategory } from "../../commonComponent/UserApi";
import { BsFillEyeFill } from "react-icons/bs";
import { RiHeartFill } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";
import { GoUpload } from "react-icons/go";

const MainContent = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllCategories()
      .then((response) => {
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]);
          fetchSubcategories(response.data[0]._id);
        }
      })
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const fetchSubcategories = (categoryId) => {
    setLoading(true);
    getAllSubCategories(categoryId)
      .then((response) => {
        setSubcategories(response.data);
        if (response.data.length > 0) {
          setSelectedSubCategory(response.data[0]);
          fetchItems(response.data[0]._id);
        }
      })
      .catch(() => setError("Failed to load subcategories"))
      .finally(() => setLoading(false));
  };

  const fetchItems = (subCategoryId) => {
    setLoading(true);
    getAllItemsBySubCategory(subCategoryId)
      .then((response) => setItems(response.data))
      .catch(() => setError("Failed to load items"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col  pt-4 bg-white">
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-row  space-x-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative rounded-3xl overflow-hidden w-80 h-40 cursor-pointer group"
            onClick={() => {
              setSelectedCategory(category);
              fetchSubcategories(category._id);
            }}
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-52 h-14 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 213 50" className="absolute w-full h-full">
                <path
                  d="M155.839 0C165.405 0 174.435 4.41668 180.308 11.9679L213 54L0 54L32.6917 11.9678C38.5648 4.41666 47.5953 0 57.1616 0L155.839 0Z"
                  fill="white"
                />
              </svg>
              <p className="absolute text-black font-semibold text-lg transition-transform duration-500 ease-out transform translate-y-2 group-hover:translate-y-0">
                {category.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="w-full max-w-screen mt-4">
          <div className="flex items-center border-gray-300">
            <button className="px-4 mr-9 py-2 flex items-center border border-black text-black font-medium rounded-none hover:bg-black hover:text-white transition-colors duration-500 ease-in-out shadow-sm group">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 35 29" fill="none" className="group-hover:stroke-white stroke-black transition-colors duration-500">
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


            <div className="flex overflow-x-auto scrollbar-hide whitespace-nowrap">
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory._id}
                  className={`px-6 py-2 text-sm font-medium cursor-pointer border border-gray-400 bg-white text-gray-500 hover:text-black hover:border-black transition-all duration-500 ease-in-out shadow-sm`}
                  onClick={() => {
                    setSelectedSubCategory(subcategory);
                    fetchItems(subcategory._id);
                  }}
                >
                  {subcategory.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-screen-lg mt-6">
        {items.map((item) => (
          <div key={item._id} className="relative rounded-xl overflow-hidden p-4 group">
            {item.label && (
              <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs rounded-full">NEW</span>
            )}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-[25rem] object-cover rounded-lg transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <h3 className="text-lg font-semibold mt-2 text-gray-800">{item.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-700 font-medium">Rs. {item.price}</p>
              <GoUpload className="text-gray-700 text-lg ml-2" />
            </div>

            {/* Icons Wrapper */}
            {/* Icons Wrapper with Right Slide Effect */}
            <div className="absolute top-6 right-6 flex flex-col space-y-2 transform translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
              <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300">
                <RiHeartFill className="text-gray-700 text-lg" />
              </button>
              <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300">
                <BsFillEyeFill className="text-gray-700 text-lg" />
              </button>
              <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300">
                <CiShoppingCart className="text-gray-700 text-lg" />
              </button>
            </div>

          </div>

        ))}
      </div>
    </div>
  );
};

export default MainContent;