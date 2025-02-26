import React, { useState, useEffect } from "react";
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  getAllCategories,
  getAllSubCategories,
} from "../../commonComponent/Api";
import { FaEdit, FaTrash, FaInfoCircle, FaPlus, FaTimes } from "react-icons/fa";

const Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    style: "",
    occasion: "",
    fit: "",
    material: "",
    discountPrice: "",
    averageRating: "",
    totalReviews: "",
    image: null,
    categoryId: "",
    subCategoryId: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItems();
        console.log("response", response.items);
        setItems(response.items);
        setFilteredItems(response.items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        console.log("response categories", response);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await getAllSubCategories();
        console.log("response subcategories", response);
        setSubcategories(response);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchItems();
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    console.log("Filtering items with:", { searchTerm, category, subcategory });
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category ? item.categoryId === category : true) &&
        (subcategory ? item.subCategoryId === subcategory : true)
    );
    console.log("Filtered items:", filtered);
    setFilteredItems(filtered);
  }, [searchTerm, category, subcategory, items]);

  const handleChange = (e) => {
    console.log("Form Change:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    console.log("File Selected:", e.target.files[0]);
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // const data = new FormData();
    // data.append("name", formData.name);
    // data.append("description", formData.description);
    // data.append("price", formData.price);
    // data.append("stock", formData.stock);
    // data.append("brand", formData.brand);
    // data.append("style", formData.style);
    // data.append("occasion", formData.occasion);
    // data.append("fit", formData.fit);
    // data.append("material", formData.material);
    // data.append("discountPrice", formData.discountPrice);
    // data.append("averageRating", formData.averageRating);
    // data.append("totalReviews", formData.totalReviews);
    // if (formData.image) {
    //   data.append("image", formData.image);
    // }
    // data.append("categoryId", category);
    // data.append("subCategoryId", subcategory);

    try {
      if (editingItem) {
        console.log("editingItem",editingItem._id)
        await updateItem(editingItem._id, formData,category,subcategory);
      } else {
        console.log("formDataToSend", formData);
        await createItem(formData,category,subcategory);
      }
      resetForm();
      fetchItems(); // Refresh items without reload
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await getAllItems();
      setItems(response.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      brand: "",
      style: "",
      occasion: "",
      fit: "",
      material: "",
      discountPrice: "",
      averageRating: "",
      totalReviews: "",
      image: null,
      categoryId: "",
      subCategoryId: "",
    });
    setEditingItem(null);
    setCategory("");
    setSubcategory("");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      brand: item.brand,
      style: Array.isArray(item.style) ? item.style.join(", ") : item.style || "",
      occasion: Array.isArray(item.occasion) ? item.occasion.join(", ") : item.occasion || "",
      fit: Array.isArray(item.fit) ? item.fit.join(", ") : item.fit || "",
      material: Array.isArray(item.material) ? item.material.join(", ") : item.material || "",
      discountPrice: item.discountPrice || "",
      averageRating: item.averageRating || "",
      totalReviews: item.totalReviews || "",
      image: null,
    });
    setCategory(item.categoryId || "");
    setSubcategory(item.subCategoryId || "");
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(itemId);
      fetchItems(); // Refresh items without reload
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleOpenModal = (item) => {
    setModalItem(item);
  };

  const handleCloseModal = () => {
    setModalItem(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 sm:text-3xl">
        Manage Items
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-1/4 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="w-full sm:w-1/4 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">All Subcategories</option>
          {subcategories
            .filter((sub) => sub.categoryId === category)
            .map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
        </select>
      </div>

      {/* Items Table */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Item</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover transition-transform hover:scale-105 cursor-pointer"
                        onClick={() => handleOpenModal(item)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800"
                          >
                            <FaInfoCircle className="inline h-4 w-4" />
                          </button>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-900">${item.price}</span>
                        {item.discountPrice && (
                          <span className="text-sm text-red-600 line-through">
                            ${item.discountPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-amber-600 hover:bg-amber-100 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-xl bg-gray-50 p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 sm:text-2xl">
          {editingItem ? "Edit Item" : "Add New Item"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image Upload
              </label>
              <label
                htmlFor="item-image"
                className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500"
              >
                <span className="text-sm text-gray-500">
                  {formData.image ? formData.image.name : "Click to upload an image"}
                </span>
                <input
                  id="item-image"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories
                    .filter((sub) => sub.categoryId === category)
                    .map((sub) => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            {["style", "occasion", "fit", "material"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Comma-separated ${field}`}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors duration-200"
        >
          {loading ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Item Modal */}
      {modalItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 p-4">
    <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh]">
      <div className="relative p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full transition-colors duration-200"
        >
          <FaTimes className="h-6 w-6" />
        </button>

        {/* Header */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          {modalItem.name}
        </h3>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={modalItem.imageUrl}
              alt={modalItem.name}
              className="w-full max-w-sm h-72 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            />
          </div>

          {/* Details */}
          <div className="space-y-5">
            {/* Price Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-600">Price:</p>
                <p className="text-lg font-semibold text-gray-900">${modalItem.price}</p>
              </div>
              {modalItem.discountPrice && (
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium text-gray-600">Discount Price:</p>
                  <p className="text-lg font-semibold text-red-600 line-through">
                    ${modalItem.discountPrice}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="space-y-3">
              {Object.entries({
                Brand: modalItem.brand,
                Stock: modalItem.stock,
                Style: Array.isArray(modalItem.style) ? modalItem.style.join(", ") : modalItem.style,
                Occasion: Array.isArray(modalItem.occasion) ? modalItem.occasion.join(", ") : modalItem.occasion,
                Fit: Array.isArray(modalItem.fit) ? modalItem.fit.join(", ") : modalItem.fit,
                Material: Array.isArray(modalItem.material) ? modalItem.material.join(", ") : modalItem.material,
                Rating: modalItem.averageRating && modalItem.totalReviews ? `${modalItem.averageRating} (${modalItem.totalReviews} reviews)` : "N/A",
              }).map(([label, value]) => (
                value && (
                  <div key={label} className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[80px]">{label}:</p>
                    <p className="text-sm text-gray-900 flex-1">{value}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
          <p className="text-sm text-gray-800 leading-relaxed">
            {modalItem.description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Items;