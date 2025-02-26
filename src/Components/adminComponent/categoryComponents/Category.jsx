import React, { useState, useEffect } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../commonComponent/Api";
import { FaEdit, FaTrash, FaTimes, FaPlus } from "react-icons/fa";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "", image: null });
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            let response;
            if (editingCategory) {
                response = await updateCategory(editingCategory._id, data);
            } else {
                response = await createCategory(data);
            }
            if (response.success) {
                loadCategories();
                closeModal();
            } else {
                console.error("Error from API:", response);
            }
        } catch (error) {
            console.error("Error saving category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const openModal = (category = null) => {
        setEditingCategory(category);
        setFormData(
            category
                ? { name: category.name, description: category.description, image: null }
                : { name: "", description: "", image: null }
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", image: null });
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageModalOpen(true);
    };

    const closeImageModal = () => {
        setImageModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Categories</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <FaPlus className="h-4 w-4" /> Add Category
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr
                                        key={category._id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                                className="h-16 w-16 rounded-lg object-cover transition-transform hover:scale-105 cursor-pointer"
                                                onClick={() => openImageModal(category.imageUrl)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {category.description || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => openModal(category)}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                                >
                                                    <FaEdit className="mr-1 h-4 w-4" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                >
                                                    <FaTrash className="mr-1 h-4 w-4" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-8 text-center text-sm text-gray-500"
                                    >
                                        No categories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-red-600 focus:outline-none"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Image
                                </label>
                                <label
                                    htmlFor="image-upload"
                                    className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500"
                                >
                                    <span className="text-sm text-gray-500">
                                        {formData.image ? formData.image.name : "Click to upload an image"}
                                    </span>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        name="image"
                                        onChange={handleChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingCategory
                                    ? "Update Category"
                                    : "Create Category"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {imageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
                        >
                            <FaTimes className="h-6 w-6" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Large view"
                            className="w-full h-auto rounded-lg shadow-2xl max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;