import React, { useState, useEffect } from "react";
import {
  getAllCategories,
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../../commonComponent/Api";

const SubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    image: null,
  });
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories on mount and after CRUD operations
  const fetchSubCategories = async () => {
    try {
      const response = await getAllSubCategories();
      console.log("All subcategories:", response);
      setSubCategories(response);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Filter subcategories based on search term and selected category
  useEffect(() => {
    let filtered = subCategories.filter((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory) {
      filtered = filtered.filter((sub) => sub.categoryId === selectedCategory);
    }
    setFilteredSubCategories(filtered);
  }, [searchTerm, selectedCategory, subCategories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("categoryId", formData.categoryId);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editingSubCategory) {
        await updateSubCategory(editingSubCategory._id, data);
      } else {
        await createSubCategory(data);
      }
      resetForm();
      fetchSubCategories(); // Refresh subcategories without reload
    } catch (error) {
      console.error("Error saving subcategory:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: "",
      image: null,
    });
    setEditingSubCategory(null);
  };

  const handleEdit = (subcategory) => {
    setEditingSubCategory(subcategory);
    setFormData({
      name: subcategory.name,
      description: subcategory.description,
      categoryId: subcategory.categoryId,
      image: null, // Reset image as it’s not typically pre-filled
    });
  };

  const handleDelete = async (subcategoryId) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await deleteSubCategory(subcategoryId);
      fetchSubCategories(); // Refresh subcategories without reload
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 sm:text-3xl">
        Manage Subcategories
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-1/2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryFilter}
          className="w-full sm:w-1/4 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubCategories.length > 0 ? (
                filteredSubCategories.map((sub) => {
                  const category = categories.find((cat) => cat._id === sub.categoryId);
                  return (
                    <tr key={sub._id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {sub.imageUrl && (
                          <img
                            src={sub.imageUrl}
                            alt={sub.name}
                            className="h-16 w-16 rounded-lg object-cover transition-transform hover:scale-105"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sub.description || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {category ? category.name : "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="inline-flex items-center rounded-md bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
                            className="inline-flex items-center rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    No subcategories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-xl bg-gray-50 p-6 shadow-lg space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subcategory Name
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
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <label
            htmlFor="subcategory-image"
            className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500"
          >
            <span className="text-sm text-gray-500">
              {formData.image ? formData.image.name : "Click to upload an image"}
            </span>
            <input
              id="subcategory-image"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors duration-200"
        >
          {loading ? "Saving..." : editingSubCategory ? "Update Subcategory" : "Add Subcategory"}
        </button>
      </form>
    </div>
  );
};

export default SubCategory;