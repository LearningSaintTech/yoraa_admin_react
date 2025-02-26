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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    descriptionAndReturns: "",
    fitDetails: "",
    careInstructions: "",
    size: { modelHeight: "", modelMeasurements: "", modelWearingSize: "" },
    manufacturerDetails: { name: "", address: "", countryOfOrigin: "", contactDetails: { phone: "", email: "" } },
    shippingAndReturns: { shippingDetails: "", returnPolicy: "" },
    images: [],
    existingImages: [],
    deletedImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Initial useEffect triggered");
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const [itemsRes, catsRes, subsRes] = await Promise.all([getAllItems(), getAllCategories(), getAllSubCategories()]);
        console.log("Items fetched:", itemsRes.items);
        console.log("Categories fetched:", catsRes.data);
        console.log("Subcategories fetched:", subsRes);
        setItems(itemsRes.items);
        setFilteredItems(itemsRes.items);
        setCategories(catsRes.data);
        setSubcategories(subsRes);
        console.log("subcategroy", subcategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [formData.existingImages,formData.deletedImages]);

  useEffect(() => {
    console.log("Filtering useEffect triggered with dependencies:", { searchTerm, category, subcategory, items, existingImages: formData.existingImages });
    setFilteredItems(items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!category || item.categoryId === category) &&
      (!subcategory || item.subCategoryId === subcategory)
    ));
    console.log("Filtered items:", filteredItems);
  }, [searchTerm, category, subcategory, items,formData.existingImages,formData.deletedImages]);

  console.log("createModalOpen", createModalOpen);

  const resetFormData = () => {
    console.log("Resetting form data");
    return {
      descriptionAndReturns: "",
      fitDetails: "",
      careInstructions: "",
      size: { modelHeight: "", modelMeasurements: "", modelWearingSize: "" },
      manufacturerDetails: { name: "", address: "", countryOfOrigin: "", contactDetails: { phone: "", email: "" } },
      shippingAndReturns: { shippingDetails: "", returnPolicy: "" },
      images: [],
      existingImages: [],
      deletedImages: [],
    };
  };

  const handleModalClose = (type) => {
    console.log("handleModalClose called with type:", type);
    if (type === "create") {
      setCreateModalOpen(false);
      setSelectedItemId(null);
      setFormData(resetFormData());
      setIsUpdate(false);
    } else if (type === "details") {
      setDetailsModalOpen(false);
      setSelectedItemDetails(null);
    } else {
      setImageModalOpen(false);
      setSelectedImageUrl(null);
    }
    setLoading(false);
    setError(null);
    console.log("Modal states after close:", { createModalOpen, detailsModalOpen, imageModalOpen });
  };

  console.log("createModalOpen121212", createModalOpen);

  const handleClick = async (type, value) => {
    console.log("handleClick called with type:", type, "value:", value);
    setIsUpdate(false);
    if (type === "create") {
      setSelectedItemId(value);
      setCreateModalOpen(true);
      console.log("createModalOpen set to true");
    } else if (type === "details" || type === "update") {
      setLoading(true);
      try {
        console.log("Fetching item details for ID:", value._id);
        const response = await getItemDetailsByItemId(value._id);
        console.log("Item details response:", response);
        setSelectedItemDetails(response);
        if (type === "update") {
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
            existingImages: response.images || [],
          });
          setSelectedItemId(value._id);
          setIsUpdate(true);
          setCreateModalOpen(true);
          console.log("Form data set for update:", formData);
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
    } else if (type === "image") {
      setSelectedImageUrl(value);
      setImageModalOpen(true);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trimStart();
    console.log("handleFormChange - name:", name, "value:", trimmedValue);
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
    console.log("Updated formData:", formData);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - formData.existingImages.length);
    console.log("handleFileChange - selected files:", files);
    setFormData({ ...formData, images: files });
    setError(files.length > (5 - formData.existingImages.length) ? "Total images cannot exceed 5." : null);
    console.log("Updated formData.images:", formData.images);
  };

  const handleDeleteImage = async (url) => {
    console.log("handleDeleteImage called with URL:", url);
    setFormData((prev) => {
      console.log("qqqqqqqqqqqqq")
      const updatedExistingImages = prev.existingImages.filter((img) => img !== url);
      const updatedDeletedImages = [...prev.deletedImages, url];
  
      console.log("Deleted Image URL:", url);
      console.log("Updated Existing Images:", updatedExistingImages);
      console.log("Updated Deleted Images:", updatedDeletedImages);
  
      return {
        ...prev,
        existingImages: updatedExistingImages,
        deletedImages: updatedDeletedImages,
      };
    });
    console.log("formData after setFormData:", formData);
  
    try {
      console.log("Deleting image from backend:", url);
      const response = await fetch(
        `https://api.yoraa.in/api/itemDetails/item-details/${selectedItemDetails.items._id}/delete-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: url }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Image deleted successfully from backend:", data);
      } else {
        console.error("Error deleting image:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
    console.log("createModalOpen after image deletion:", createModalOpen);
  };

  const handleSubmit = async (e, isUpdateMode = false) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log("handleSubmit called - isUpdateMode:", isUpdateMode);

    try {
      const itemDetailsData = {
        descriptionAndReturns: formData.descriptionAndReturns,
        fitDetails: formData.fitDetails ? formData.fitDetails.split(",").map((item) => item.trim()) : [],
        careInstructions: formData.careInstructions,
        size: formData.size,
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
      console.log("itemDetailsData:", itemDetailsData);

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(itemDetailsData));
      if (formData.images.length > 0) {
        formData.images.forEach((image) => formDataToSend.append("images", image));
      }
      if (isUpdateMode) formDataToSend.append("deletedImages", JSON.stringify(formData.deletedImages));

      console.log("selectedItemDetails", selectedItemDetails.items._id);
      const apiCall = isUpdateMode
        ? updateItemDetails(selectedItemDetails.items._id, itemDetailsData, { images: formData.images })
        : createItemDetails(selectedItemId, formDataToSend);

      await apiCall;
      const response = await getAllItems();
      console.log("Items after submit:", response.items);
      setItems(response.items);
      setFilteredItems(response.items);
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
    console.log("handleDeleteClick called with itemId:", itemId);
    if (window.confirm("Are you sure you want to delete this item’s details?")) {
      setLoading(true);
      setError(null);
      try {
        await deleteItemDetails(itemId);
        const response = await getAllItems();
        console.log("Items after delete:", response.items);
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
        <input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={inputClass} style={{ width: "33%" }} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} style={{ width: "25%" }}>
          <option value="">All Categories</option>
          {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
        <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={inputClass} style={{ width: "25%" }}>
          <option value="">All Subcategories</option>
          {subcategories.filter((sub) => sub.categoryId === category).map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
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
              {filteredItems.length ? filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => handleClick("image", item.imageUrl)} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleClick("details", item)} className="text-indigo-600 hover:text-indigo-800 focus:ring-2 focus:ring-indigo-500 rounded-full p-1">
                      <FaInfoCircle className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.isItemDetail ? "Yes" : "No"}</td>
                  <td className="px-6 py-4 text-right">
                    {item.isItemDetail ? (
                      <button onClick={() => handleClick("update", item)} className={`${buttonClass} bg-amber-600 hover:bg-amber-700 focus:ring-amber-500`}>
                        <FaEdit className="mr-2 h-4 w-4" /> Update
                      </button>
                    ) : (
                      <button onClick={() => handleClick("create", item._id)} className={`${buttonClass} bg-green-600 hover:bg-green-700 focus:ring-green-500`}>
                        <FaPlus className="mr-2 h-4 w-4" /> Create
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto">
            <div className="relative p-6 sm:p-8">
              <button onClick={() => handleModalClose("create")} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full">
                <FaTimes className="h-6 w-6" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{isUpdate ? "Update Item Details" : "Create Item Details"}</h3>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <form onSubmit={(e) => handleSubmit(e, isUpdate)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description and Returns</label>
                  <textarea name="descriptionAndReturns" value={formData.descriptionAndReturns} onChange={handleFormChange} rows="3" className={textareaClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fit Details (comma-separated)</label>
                  <input type="text" name="fitDetails" value={formData.fitDetails} onChange={handleFormChange} placeholder="e.g., Regular Fit, Mid Rise" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Care Instructions</label>
                  <input type="text" name="careInstructions" value={formData.careInstructions} onChange={handleFormChange} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["modelHeight", "modelMeasurements", "modelWearingSize"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                      <input type="text" name={`size.${field}`} value={formData.size[field]} onChange={handleFormChange} placeholder={`e.g., ${field === "modelHeight" ? "Model height 188cm" : field === "modelMeasurements" ? "Chest-39, Waist-32" : "Size M"}`} className={inputClass} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["name", "countryOfOrigin"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">{field === "name" ? "Manufacturer Name" : "Country of Origin"}</label>
                      <input type="text" name={`manufacturerDetails.${field}`} value={formData.manufacturerDetails[field]} onChange={handleFormChange} className={inputClass} required />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer Address</label>
                  <textarea name="manufacturerDetails.address" value={formData.manufacturerDetails.address} onChange={handleFormChange} rows="2" className={textareaClass} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["phone", "email"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">{field === "phone" ? "Contact Phone" : "Contact Email"}</label>
                      <input type={field === "email" ? "email" : "text"} name={`manufacturerDetails.contactDetails.${field}`} value={formData.manufacturerDetails.contactDetails[field]} onChange={handleFormChange} className={inputClass} required />
                    </div>
                  ))}
                </div>
                {["shippingDetails", "returnPolicy"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())} (one per line)</label>
                    <textarea name={`shippingAndReturns.${field}`} value={formData.shippingAndReturns[field]} onChange={handleFormChange} rows="4" placeholder={`Enter each ${field.split("D")[0]} on a new line`} className={textareaClass} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Images (up to 5)</label>
                  {isUpdate && formData.existingImages.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.existingImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Existing ${index + 1}`} className="h-16 w-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"  />
                          <button onClick={() => handleDeleteImage(url)} className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full hover:bg-red-700">
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label htmlFor="item-details-images" className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-indigo-500">
                    <span className="text-sm text-gray-500">{formData.images.length > 0 ? `${formData.images.length} new image(s) selected` : "Click to upload new images"}</span>
                    <input id="item-details-images" type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                  </label>
                  {formData.images.length + formData.existingImages.length > 5 && <p className="text-red-600 text-sm mt-2">Total images cannot exceed 5.</p>}
                </div>
                <button type="submit" disabled={loading || formData.images.length + formData.existingImages.length > 5} className={`${buttonClass} w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400`}>
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
              <button onClick={() => handleModalClose("details")} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full">
                <FaTimes className="h-6 w-6" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Item Details</h3>
              {loading ? <p className="text-gray-600">Loading...</p> : error ? <p className="text-red-600 text-sm mb-4">{error}</p> : selectedItemDetails ? (
                <div className="space-y-4">
                  {Object.entries({
                    "Description and Returns": selectedItemDetails.descriptionAndReturns,
                    "Fit Details": selectedItemDetails.fitDetails?.join(", "),
                    "Care Instructions": selectedItemDetails.careInstructions,
                    "Model Height": selectedItemDetails.size?.modelHeight,
                    "Model Measurements": selectedItemDetails.size?.modelMeasurements,
                    "Model Wearing Size": selectedItemDetails.size?.modelWearingSize,
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
                    <p className="text-sm font-medium text-gray-600 min-w-[150px]">Images:</p>
                    <div className="flex-1">
                      {selectedItemDetails.images?.length ? selectedItemDetails.images.map((url, i) => (
                        <img key={i} src={url} alt={`Image ${i + 1}`} className="h-16 w-16 rounded-lg object-cover inline-block mr-2 mb-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => handleClick("image", url)} />
                      )) : <p className="text-sm text-gray-900">N/A</p>}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteClick(selectedItemDetails._id)} className={`${buttonClass} bg-red-600 hover:bg-red-700 focus:ring-red-500 mt-4`} disabled={loading}>
                    {loading ? "Deleting..." : "Delete Item Details"}
                  </button>
                </div>
              ) : <p className="text-gray-600">No details available.</p>}
            </div>
          </div>
        </div>
      )}
      {imageModalOpen && selectedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full transform transition-all duration-300 scale-95 hover:scale-100">
            <button onClick={() => handleModalClose("image")} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full">
              <FaTimes className="h-6 w-6" />
            </button>
            <img src={selectedImageUrl} alt="Large Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsDetails;