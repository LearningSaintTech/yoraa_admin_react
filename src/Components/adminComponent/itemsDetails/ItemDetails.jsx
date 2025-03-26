import React, { useState, useEffect } from "react";
import {
  getAllItems,
  getAllCategories,
  getAllSubCategories,
  createItemDetails,
  getItemDetailsByItemId,
  updateItemDetails,
  deleteItemDetails,
} from "../../commonComponent/Api";
import { FaEdit, FaPlus, FaTimes, FaInfoCircle, FaTrash } from "react-icons/fa";

const ItemsDetails = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    descriptionAndReturns: "",
    fitDetails: "",
    careInstructions: "",
    size: { modelHeight: "", modelMeasurements: "", modelWearingSize: "" },
    sizes: [],
    manufacturerDetails: { name: "", address: "", countryOfOrigin: "", contactDetails: { phone: "", email: "" } },
    shippingAndReturns: { shippingDetails: "", returnPolicy: "" },
    media: [], // New media with color and file data
    existingMedia: [], // Existing media grouped by color
    deletedMedia: [], // Media URLs to delete
    colors: [], // Array of colors for new media
    mediaPriority: [], // Priority array for all media
    sizeChartInch: null,
    sizeChartCm: null,
    sizeMeasurement: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, catsRes, subsRes] = await Promise.all([getAllItems(), getAllCategories(), getAllSubCategories()]);
        setItems(itemsRes.items);
        setFilteredItems(itemsRes.items);
        setCategories(catsRes.data);
        setSubcategories(subsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredItems(
      items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!category || item.categoryId === category) &&
          (!subcategory || item.subCategoryId === subcategory)
      )
    );
  }, [searchTerm, category, subcategory, items]);

  const resetFormData = () => ({
    descriptionAndReturns: "",
    fitDetails: "",
    careInstructions: "",
    size: { modelHeight: "", modelMeasurements: "", modelWearingSize: "" },
    sizes: [],
    manufacturerDetails: { name: "", address: "", countryOfOrigin: "", contactDetails: { phone: "", email: "" } },
    shippingAndReturns: { shippingDetails: "", returnPolicy: "" },
    media: [],
    existingMedia: [],
    deletedMedia: [],
    colors: [],
    mediaPriority: [],
    sizeChartInch: null,
    sizeChartCm: null,
    sizeMeasurement: null,
  });

  const handleModalClose = (type) => {
    if (type === "create") {
      setCreateModalOpen(false);
      setSelectedItemId(null);
      setFormData(resetFormData());
      setIsUpdate(false);
    } else if (type === "details") {
      setDetailsModalOpen(false);
      setSelectedItemDetails(null);
    } else {
      setMediaModalOpen(false);
      setSelectedMediaUrl(null);
      setSelectedMediaType(null);
    }
    setLoading(false);
    setError(null);
  };

  const handleClick = async (type, value) => {
    setIsUpdate(false);
    if (type === "create") {
      setSelectedItemId(value);
      setCreateModalOpen(true);
    } else if (type === "details" || type === "update") {
      setLoading(true);
      try {
        const response = await getItemDetailsByItemId(value._id);
        setSelectedItemDetails(response);
        if (type === "update") {
          const existingMedia = response.media || [];
          const mediaPriority = existingMedia.flatMap((group) =>
            group.mediaItems.map((item) => item.priority || 0)
          );
          setFormData({
            ...resetFormData(),
            descriptionAndReturns: response.descriptionAndReturns || "",
            fitDetails: response.fitDetails?.join(", ") || "",
            careInstructions: response.careInstructions || "",
            size: {
              modelHeight: response.size?.modelHeight || "",
              modelMeasurements: response.size?.modelMeasurements || "",
              modelWearingSize: response.size?.modelWearingSize || "",
            },
            sizes: response.sizes || [],
            manufacturerDetails: {
              name: response.manufacturerDetails?.name || "",
              address: response.manufacturerDetails?.address || "",
              countryOfOrigin: response.manufacturerDetails?.countryOfOrigin || "",
              contactDetails: {
                phone: response.manufacturerDetails?.contactDetails?.phone || "",
                email: response.manufacturerDetails?.contactDetails?.email || "",
              },
            },
            shippingAndReturns: {
              shippingDetails: response.shippingAndReturns?.shippingDetails?.join("\n") || "",
              returnPolicy: response.shippingAndReturns?.returnPolicy?.join("\n") || "",
            },
            existingMedia,
            mediaPriority,
            colors: existingMedia.map((group) => group.color),
            media: existingMedia.map((group) => ({ ...group, files: [] })), // Initialize files for each color
            sizeChartInch: response.sizeChartInch || null,
            sizeChartCm: response.sizeChartCm || null,
            sizeMeasurement: response.sizeMeasurement || null,
          });
          setSelectedItemId(value._id);
          setIsUpdate(true);
          setCreateModalOpen(true);
        } else {
          setDetailsModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        setError("Failed to load item details: " + (error.message || "Unknown error"));
        type === "details" && setDetailsModalOpen(true);
      } finally {
        setLoading(false);
      }
    } else if (type === "media") {
      setSelectedMediaUrl(value.url);
      setSelectedMediaType(value.type);
      setMediaModalOpen(true);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trimStart();
    if (name.includes(".")) {
      const [parent, child, grandChild] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandChild ? { ...prev[parent][child], [grandChild]: trimmedValue } : trimmedValue,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: trimmedValue });
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const addSizeField = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, { size: "", stock: "" }] });
  };

  const removeSizeField = (index) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) });
  };

  const handleColorChange = (e, index) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = e.target.value;
    setFormData({ ...formData, colors: updatedColors });
  };

  const addColorGroup = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, ""],
      media: [...prev.media, { files: [], color: "" }],
    }));
  };

  const removeColorGroup = (index) => {
    const updatedColors = formData.colors.filter((_, i) => i !== index);
    const updatedMedia = formData.media.filter((_, i) => i !== index);
    const updatedPriority = formData.mediaPriority.filter((_, i) => i < formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) + index * 5);
    setFormData({ ...formData, colors: updatedColors, media: updatedMedia, mediaPriority: updatedPriority });
  };

  const handleMediaChange = (e, colorIndex, mediaType) => {
    const files = Array.from(e.target.files);
    const totalMediaPerColor = 5;
    const currentMediaForColor = formData.media[colorIndex]?.files?.length || 0;
    const allowedNewMedia = totalMediaPerColor - currentMediaForColor;

    if (files.length > allowedNewMedia) {
      setError(`Cannot upload more than ${totalMediaPerColor} media items per color.`);
      return;
    }

    const newMedia = files.slice(0, allowedNewMedia).map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      type: mediaType,
      priority: (formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) +
        colorIndex * 5 +
        currentMediaForColor +
        index),
    }));

    const updatedMedia = [...formData.media];
    updatedMedia[colorIndex] = {
      ...updatedMedia[colorIndex],
      files: [...(updatedMedia[colorIndex]?.files || []), ...newMedia], // Ensure files exists
    };
    const updatedPriority = [
      ...formData.mediaPriority,
      ...newMedia.map((m) => m.priority),
    ];
    setFormData({ ...formData, media: updatedMedia, mediaPriority: updatedPriority });
    setError(null);
  };

  const handlePriorityChange = (index, value) => {
    const updatedPriority = [...formData.mediaPriority];
    updatedPriority[index] = parseInt(value) || 0;
    setFormData({ ...formData, mediaPriority: updatedPriority });
  };

  const handleRemoveNewMedia = (colorIndex, imageIndex) => {
    const updatedMedia = [...formData.media];
    updatedMedia[colorIndex].files = updatedMedia[colorIndex].files.filter((_, i) => i !== imageIndex);
    const updatedPriority = formData.mediaPriority.filter((_, i) => i !== (formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) + colorIndex * 5 + imageIndex));
    setFormData({ ...formData, media: updatedMedia, mediaPriority: updatedPriority });
  };

  const handleDeleteMedia = async (color, mediaUrl) => {
    setFormData((prev) => {
      const updatedExistingMedia = prev.existingMedia.map((group) => {
        if (group.color === color) {
          return { ...group, mediaItems: group.mediaItems.filter((item) => item.url !== mediaUrl) };
        }
        return group;
      }).filter((group) => group.mediaItems.length > 0);
      const updatedDeletedMedia = [...prev.deletedMedia, { color, url: mediaUrl }];
      const mediaIndex = prev.existingMedia.flatMap((g) => g.mediaItems).findIndex((item) => item.url === mediaUrl);
      const updatedPriority = prev.mediaPriority.filter((_, i) => i !== mediaIndex);
      return {
        ...prev,
        existingMedia: updatedExistingMedia,
        deletedMedia: updatedDeletedMedia,
        mediaPriority: updatedPriority,
      };
    });

    try {
      const response = await fetch(
        `https://api.yoraa.in/api/itemDetails/item-details/${selectedItemDetails.items._id}/delete-media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaUrl, color }),
        }
      );
      const data = await response.json();
      if (!response.ok) console.error("Error deleting media:", data.error);
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, [field]: files[0] || null });
  };

  const handleSubmit = async (e, isUpdateMode = false) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const itemDetailsData = {
        descriptionAndReturns: formData.descriptionAndReturns,
        fitDetails: formData.fitDetails ? formData.fitDetails.split(",").map((item) => item.trim()) : [],
        careInstructions: formData.careInstructions,
        size: formData.size,
        sizes: formData.sizes,
        manufacturerDetails: formData.manufacturerDetails,
        shippingAndReturns: {
          shippingDetails: formData.shippingAndReturns.shippingDetails
            ? formData.shippingAndReturns.shippingDetails.split("\n").map((item) => item.trim())
            : [],
          returnPolicy: formData.shippingAndReturns.returnPolicy
            ? formData.shippingAndReturns.returnPolicy.split("\n").map((item) => item.trim())
            : [],
        },
      };

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(itemDetailsData));
      formDataToSend.append("colors", JSON.stringify(formData.colors));

      // Append new images and videos
      formData.media.forEach((colorGroup) => {
        colorGroup.files.forEach((media) => {
          if (media.type === "image") {
            formDataToSend.append("images", media.file);
          } else {
            formDataToSend.append("videos", media.file);
          }
        });
      });

      // Build priorityArray for all media
      const totalMediaCount = formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) + formData.media.flatMap((g) => g.files.length).reduce((a, b) => a + b, 0);
      const priorityArray = Array(totalMediaCount).fill(0);
      formData.existingMedia.forEach((group) => {
        group.mediaItems.forEach((item, index) => {
          priorityArray[index] = formData.mediaPriority[index] !== undefined ? parseInt(formData.mediaPriority[index]) : 0;
        });
      });
      formData.media.forEach((group, colorIndex) => {
        group.files.forEach((item, index) => {
          const priorityIndex = formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) + colorIndex * 5 + index;
          priorityArray[priorityIndex] = formData.mediaPriority[priorityIndex] !== undefined ? parseInt(formData.mediaPriority[priorityIndex]) : priorityIndex;
        });
      });
      formDataToSend.append("priority", JSON.stringify(priorityArray));

      if (formData.sizeChartInch) formDataToSend.append("sizeChartInch", formData.sizeChartInch);
      if (formData.sizeChartCm) formDataToSend.append("sizeChartCm", formData.sizeChartCm);
      if (formData.sizeMeasurement) formDataToSend.append("sizeMeasurement", formData.sizeMeasurement);
      if (isUpdateMode) formDataToSend.append("deletedMedia", JSON.stringify(formData.deletedMedia.map((d) => ({ url: d.url, color: d.color }))));

      for (let pair of formDataToSend.entries()) {
        console.log(`FormData pair: ${pair[0]}: ${pair[1]}`);
      }

      const apiCall = isUpdateMode
        ? updateItemDetails(selectedItemDetails.items._id, formDataToSend)
        : createItemDetails(selectedItemId, formDataToSend);

      const response = await apiCall;
      const itemsResponse = await getAllItems();
      setItems(itemsResponse.items);
      setFilteredItems(itemsResponse.items);
      handleModalClose("create");
    } catch (error) {
      console.error(`Error ${isUpdateMode ? "updating" : "creating"} item details:`, error);
      setError(
        error.message.includes("validation failed")
          ? "Please fill all required fields: " + error.message.split(":")[1]
          : `Failed to ${isUpdateMode ? "update" : "create"} item details: ` + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item’s details?")) {
      setLoading(true);
      setError(null);
      try {
        await deleteItemDetails(itemId);
        const response = await getAllItems();
        setItems(response.items);
        setFilteredItems(response.items);
        setDetailsModalOpen(false);
      } catch (error) {
        console.error("Error deleting item details:", error);
        setError("Failed to delete item details: " + (error.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    }
  };

  const inputClass = "mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";
  const textareaClass = `${inputClass} resize-y`;
  const buttonClass = "inline-flex items-center px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 transition-colors";

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 sm:text-3xl">Manage Item Details</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={inputClass}
          style={{ width: "33%" }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} style={{ width: "25%" }}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={inputClass} style={{ width: "25%" }}>
          <option value="">All Subcategories</option>
          {subcategories.filter((sub) => sub.categoryId === category).map((sub) => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Item</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Info</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Details</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length ? (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleClick("media", { url: item.imageUrl, type: "image" })}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleClick("details", item)}
                        className="text-indigo-600 hover:text-indigo-800 focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
                      >
                        <FaInfoCircle className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.isItemDetail ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 text-right">
                      {item.isItemDetail ? (
                        <button
                          onClick={() => handleClick("update", item)}
                          className={`${buttonClass} bg-amber-600 hover:bg-amber-700 focus:ring-amber-500`}
                        >
                          <FaEdit className="mr-2 h-4 w-4" /> Update
                        </button>
                      ) : (
                        <button
                          onClick={() => handleClick("create", item._id)}
                          className={`${buttonClass} bg-green-600 hover:bg-green-700 focus:ring-green-500`}
                        >
                          <FaPlus className="mr-2 h-4 w-4" /> Create
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto">
            <div className="relative p-6 sm:p-8">
              <button
                onClick={() => handleModalClose("create")}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full"
              >
                <FaTimes className="h-6 w-6" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{isUpdate ? "Update Item Details" : "Create Item Details"}</h3>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <form onSubmit={(e) => handleSubmit(e, isUpdate)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description and Returns</label>
                  <textarea
                    name="descriptionAndReturns"
                    value={formData.descriptionAndReturns}
                    onChange={handleFormChange}
                    rows="3"
                    className={textareaClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fit Details (comma-separated)</label>
                  <input
                    type="text"
                    name="fitDetails"
                    value={formData.fitDetails}
                    onChange={handleFormChange}
                    placeholder="e.g., Regular Fit, Mid Rise"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Care Instructions</label>
                  <input type="text" name="careInstructions" value={formData.careInstructions} onChange={handleFormChange} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["modelHeight", "modelMeasurements", "modelWearingSize"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        name={`size.${field}`}
                        value={formData.size[field]}
                        onChange={handleFormChange}
                        placeholder={`e.g., ${field === "modelHeight" ? "Model height 188cm" : field === "modelMeasurements" ? "Chest-39, Waist-32" : "Size M"}`}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sizes and Stock</label>
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                        placeholder="Size (e.g., M)"
                        className={inputClass}
                      />
                      <input
                        type="number"
                        value={size.stock}
                        onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                        placeholder="Stock"
                        min="0"
                        className={inputClass}
                      />
                      <button type="button" onClick={() => removeSizeField(index)} className="text-red-600 hover:text-red-800">
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSizeField}
                    className={`${buttonClass} bg-green-600 hover:bg-green-700 focus:ring-green-500 mt-2`}
                  >
                    <FaPlus className="mr-2 h-4 w-4" /> Add Size
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["name", "countryOfOrigin"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field === "name" ? "Manufacturer Name" : "Country of Origin"}
                      </label>
                      <input
                        type="text"
                        name={`manufacturerDetails.${field}`}
                        value={formData.manufacturerDetails[field]}
                        onChange={handleFormChange}
                        className={inputClass}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer Address</label>
                  <textarea
                    name="manufacturerDetails.address"
                    value={formData.manufacturerDetails.address}
                    onChange={handleFormChange}
                    rows="2"
                    className={textareaClass}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["phone", "email"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field === "phone" ? "Contact Phone" : "Contact Email"}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={`manufacturerDetails.contactDetails.${field}`}
                        value={formData.manufacturerDetails.contactDetails[field]}
                        onChange={handleFormChange}
                        className={inputClass}
                        required
                      />
                    </div>
                  ))}
                </div>
                {["shippingDetails", "returnPolicy"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} (one per line)
                    </label>
                    <textarea
                      name={`shippingAndReturns.${field}`}
                      value={formData.shippingAndReturns[field]}
                      onChange={handleFormChange}
                      rows="4"
                      placeholder={`Enter each ${field.split("D")[0]} on a new line`}
                      className={textareaClass}
                    />
                  </div>
                ))}
                {/* Updated Media Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Media (Images or Videos by Color, up to 5 per color)</label>
                  {/* Display Existing Media */}
                  {isUpdate && formData.existingMedia.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {formData.existingMedia.map((group, colorIndex) =>
                        group.mediaItems.map((media, mediaIndex) => (
                          <div key={`${colorIndex}-${mediaIndex}`} className="relative flex flex-col items-center">
                            {media.type === "image" ? (
                              <img
                                src={media.url}
                                alt={`${group.color} Media ${mediaIndex + 1}`}
                                className="h-16 w-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => handleClick("media", media)}
                              />
                            ) : (
                              <video
                                src={media.url}
                                className="h-16 w-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => handleClick("media", media)}
                              />
                            )}
                            <div className="flex items-center mt-1">
                              <input
                                type="number"
                                value={formData.mediaPriority[colorIndex * 5 + mediaIndex]}
                                onChange={(e) => handlePriorityChange(colorIndex * 5 + mediaIndex, e.target.value)}
                                className="w-16 px-2 py-1 border rounded-md text-sm"
                                placeholder="Priority"
                              />
                              <button
                                onClick={() => handleDeleteMedia(group.color, media.url)}
                                className="ml-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                              >
                                <FaTrash className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {/* Display Newly Uploaded Media */}
                  {console.log("formData.media:", formData.media)}
                  {formData.media.map((colorGroup, colorIndex) => (
                    (colorGroup.files?.length > 0 || (colorGroup.files === undefined && formData.existingMedia[colorIndex]?.mediaItems?.length > 0)) && (
                      <div key={colorIndex} className="mb-4 flex flex-wrap gap-2">
                        {(colorGroup.files || []).map((media, mediaIndex) => (
                          <div key={mediaIndex} className="relative flex flex-col items-center">
                            {media.type === "image" ? (
                              <img
                                src={media.preview}
                                alt={`${formData.colors[colorIndex]} New Media ${mediaIndex + 1}`}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            ) : (
                              <video
                                src={media.preview}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex items-center mt-1">
                              <input
                                type="number"
                                value={formData.mediaPriority[
                                  formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) +
                                  colorIndex * 5 +
                                  mediaIndex
                                ] || 0}
                                onChange={(e) =>
                                  handlePriorityChange(
                                    formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) +
                                      colorIndex * 5 +
                                      mediaIndex,
                                    e.target.value
                                  )
                                }
                                className="w-16 px-2 py-1 border rounded-md text-sm"
                                placeholder="Priority"
                              />
                              <button
                                onClick={() => handleRemoveNewMedia(colorIndex, mediaIndex)}
                                className="ml-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                              >
                                <FaTrash className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                  {/* Upload New Media by Color */}
                  {formData.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="mb-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleColorChange(e, colorIndex)}
                          placeholder="Color (e.g., red)"
                          className={inputClass}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeColorGroup(colorIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <label
                          htmlFor={`item-details-images-${colorIndex}`}
                          className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500"
                        >
                          <span className="text-sm text-gray-500">
                            {formData.media[colorIndex]?.files?.filter((m) => m.type === "image").length > 0
                              ? `${formData.media[colorIndex].files.filter((m) => m.type === "image").length} image(s) selected`
                              : "Click to upload images"}
                          </span>
                          <input
                            id={`item-details-images-${colorIndex}`}
                            type="file"
                            multiple
                            onChange={(e) => handleMediaChange(e, colorIndex, "image")}
                            className="hidden"
                            accept="image/*"
                            disabled={formData.media[colorIndex]?.files?.filter((m) => m.type === "image").length >= 5 || formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) + formData.media.flatMap((g) => g.files?.length || 0).reduce((a, b) => a + b, 0) >= 25}
                          />
                        </label>
                        <label
                          htmlFor={`item-details-videos-${colorIndex}`}
                          className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500"
                        >
                          <span className="text-sm text-gray-500">
                            {formData.media[colorIndex]?.files?.filter((m) => m.type === "video").length > 0
                              ? `${formData.media[colorIndex].files.filter((m) => m.type === "video").length} video(s) selected`
                              : "Click to upload videos"}
                          </span>
                          <input
                            id={`item-details-videos-${colorIndex}`}
                            type="file"
                            multiple
                            onChange={(e) => handleMediaChange(e, colorIndex, "video")}
                            className="hidden"
                            accept="video/*"
                            disabled={formData.media[colorIndex]?.files?.filter((m) => m.type === "video").length >= 5 || formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) + formData.media.flatMap((g) => g.files?.length || 0).reduce((a, b) => a + b, 0) >= 25}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addColorGroup}
                    className={`${buttonClass} bg-green-600 hover:bg-green-700 focus:ring-green-500 mt-2`}
                  >
                    <FaPlus className="mr-2 h-4 w-4" /> Add Color
                  </button>
                  {(formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) + formData.media.flatMap((g) => g.files?.length || 0).reduce((a, b) => a + b, 0) > 25) && (
                    <p className="text-red-600 text-sm mt-2">Total media cannot exceed 25 (5 colors * 5 media items).</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size Chart (Inches)</label>
                  {isUpdate && formData.sizeChartInch && (
                    <div className="mb-2">
                      <img src={formData.sizeChartInch} alt="Size Chart Inch" className="h-16 w-16 rounded-lg object-cover inline-block mr-2" />
                      <button onClick={() => setFormData({ ...formData, sizeChartInch: null })} className="text-red-600 hover:text-red-800">
                        <FaTrash className="h-5 w-5 inline" />
                      </button>
                    </div>
                  )}
                  <label
                    htmlFor="size-chart-inch"
                    className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500"
                  >
                    <span className="text-sm text-gray-500">
                      {formData.sizeChartInch ? "New size chart (inches) selected" : "Click to upload size chart (inches)"}
                    </span>
                    <input
                      id="size-chart-inch"
                      type="file"
                      onChange={(e) => handleFileChange(e, "sizeChartInch")}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size Chart (Centimeters)</label>
                  {isUpdate && formData.sizeChartCm && (
                    <div className="mb-2">
                      <img src={formData.sizeChartCm} alt="Size Chart Cm" className="h-16 w-16 rounded-lg object-cover inline-block mr-2" />
                      <button onClick={() => setFormData({ ...formData, sizeChartCm: null })} className="text-red-600 hover:text-red-800">
                        <FaTrash className="h-5 w-5 inline" />
                      </button>
                    </div>
                  )}
                  <label
                    htmlFor="size-chart-cm"
                    className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500"
                  >
                    <span className="text-sm text-gray-500">
                      {formData.sizeChartCm ? "New size chart (cm) selected" : "Click to upload size chart (cm)"}
                    </span>
                    <input
                      id="size-chart-cm"
                      type="file"
                      onChange={(e) => handleFileChange(e, "sizeChartCm")}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size Measurement Image</label>
                  {isUpdate && formData.sizeMeasurement && (
                    <div className="mb-2">
                      <img src={formData.sizeMeasurement} alt="Size Measurement" className="h-16 w-16 rounded-lg object-cover inline-block mr-2" />
                      <button onClick={() => setFormData({ ...formData, sizeMeasurement: null })} className="text-red-600 hover:text-red-800">
                        <FaTrash className="h-5 w-5 inline" />
                      </button>
                    </div>
                  )}
                  <label
                    htmlFor="size-measurement"
                    className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500"
                  >
                    <span className="text-sm text-gray-500">
                      {formData.sizeMeasurement ? "New size measurement selected" : "Click to upload size measurement"}
                    </span>
                    <input
                      id="size-measurement"
                      type="file"
                      onChange={(e) => handleFileChange(e, "sizeMeasurement")}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading || (formData.existingMedia.flatMap((g) => g.mediaItems.length).reduce((a, b) => a + b, 0) + formData.media.flatMap((g) => g.files?.length || 0).reduce((a, b) => a + b, 0) > 25)}
                  className={`${buttonClass} w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400`}
                >
                  {loading ? "Processing..." : isUpdate ? "Update Item Details" : "Create Item Details"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto">
            <div className="relative p-6 sm:p-8">
              <button
                onClick={() => handleModalClose("details")}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full"
              >
                <FaTimes className="h-6 w-6" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Item Details</h3>
              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : error ? (
                <p className="text-red-600 text-sm mb-4">{error}</p>
              ) : selectedItemDetails ? (
                <div className="space-y-4">
                  {Object.entries({
                    "Description and Returns": selectedItemDetails.descriptionAndReturns,
                    "Fit Details": selectedItemDetails.fitDetails?.join(", "),
                    "Care Instructions": selectedItemDetails.careInstructions,
                    "Model Height": selectedItemDetails.size?.modelHeight,
                    "Model Measurements": selectedItemDetails.size?.modelMeasurements,
                    "Model Wearing Size": selectedItemDetails.size?.modelWearingSize,
                    "Sizes": selectedItemDetails.sizes?.map((s) => `${s.size}: ${s.stock}`).join(", "),
                    "Manufacturer Name": selectedItemDetails.manufacturerDetails?.name,
                    "Manufacturer Address": selectedItemDetails.manufacturerDetails?.address,
                    "Country of Origin": selectedItemDetails.manufacturerDetails?.countryOfOrigin,
                    "Contact Phone": selectedItemDetails.manufacturerDetails?.contactDetails?.phone,
                    "Contact Email": selectedItemDetails.manufacturerDetails?.contactDetails?.email,
                    "Shipping Details": selectedItemDetails.shippingAndReturns?.shippingDetails?.map((d, i) => <span key={i} className="block">{d}</span>),
                    "Return Policy": selectedItemDetails.shippingAndReturns?.returnPolicy?.map((p, i) => <span key={i} className="block">{p}</span>),
                  }).map(([label, value]) => (
                    <div key={label} className="flex items-start gap-3">
                      <p className="text-sm font-medium text-gray-600 min-w-[150px]">{label}:</p>
                      <p className="text-sm text-gray-900 flex-1">{value || "N/A"}</p>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[150px]">Media:</p>
                    <div className="flex-1">
                      {selectedItemDetails.media?.length
                        ? selectedItemDetails.media.map((group, colorIndex) =>
                            group.mediaItems.map((media, mediaIndex) =>
                              media.type === "image" ? (
                                <img
                                  key={`${colorIndex}-${mediaIndex}`}
                                  src={media.url}
                                  alt={`${group.color} Media ${mediaIndex + 1}`}
                                  className="h-16 w-16 rounded-lg object-cover inline-block mr-2 mb-2 cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => handleClick("media", media)}
                                />
                              ) : (
                                <video
                                  key={`${colorIndex}-${mediaIndex}`}
                                  src={media.url}
                                  className="h-16 w-16 rounded-lg object-cover inline-block mr-2 mb-2 cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => handleClick("media", media)}
                                />
                              )
                            )
                          )
                        : "N/A"}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[150px]">Size Chart (Inches):</p>
                    <div className="flex-1">
                      {selectedItemDetails.sizeChartInch ? (
                        <img
                          src={selectedItemDetails.sizeChartInch}
                          alt="Size Chart Inch"
                          className="h-16 w-16 rounded-lg object-cover inline-block mr-2 mb-2 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => handleClick("media", { url: selectedItemDetails.sizeChartInch, type: "image" })}
                        />
                      ) : (
                        <p className="text-sm text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[150px]">Size Chart (Centimeters):</p>
                    <div className="flex-1">
                      {selectedItemDetails.sizeChartCm ? (
                        <img
                          src={selectedItemDetails.sizeChartCm}
                          alt="Size Chart Cm"
                          className="h-16 w-16 rounded-lg object-cover inline-block mr-2 mb-2 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => handleClick("media", { url: selectedItemDetails.sizeChartCm, type: "image" })}
                        />
                      ) : (
                        <p className="text-sm text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[150px]">Size Measurement:</p>
                    <div className="flex-1">
                      {selectedItemDetails.sizeMeasurement ? (
                        <img
                          src={selectedItemDetails.sizeMeasurement}
                          alt="Size Measurement"
                          className="h-16 w-16 rounded-lg object-cover inline-block mr-2 mb-2 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => handleClick("media", { url: selectedItemDetails.sizeMeasurement, type: "image" })}
                        />
                      ) : (
                        <p className="text-sm text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(selectedItemDetails._id)}
                    className={`${buttonClass} bg-red-600 hover:bg-red-700 focus:ring-red-500 mt-4`}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete Item Details"}
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">No details available.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {mediaModalOpen && selectedMediaUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full transform transition-all duration-300 scale-95 hover:scale-100">
            <button
              onClick={() => handleModalClose("media")}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full"
            >
              <FaTimes className="h-6 w-6" />
            </button>
            {selectedMediaType === "image" ? (
              <img src={selectedMediaUrl} alt="Large Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            ) : (
              <video src={selectedMediaUrl} controls className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsDetails;