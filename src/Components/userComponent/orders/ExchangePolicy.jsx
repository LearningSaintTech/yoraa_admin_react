// ExchangePolicy.jsx

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { createExchangeOrder } from "../../commonComponent/UserApi"; // Adjust the import path as needed

const ExchangePolicy = () => {
  const location = useLocation();
  const { orderId, itemId } = location.state || {};

  const [desiredSize, setDesiredSize] = useState("");
  const [reason, setReason] = useState("");

  const handleExchangeRequest = async () => {
    if (!desiredSize || !reason) {
      alert("Please select a size and provide a reason.");
      return;
    }

    if (!orderId || !itemId) {
      alert("Missing order or item details. Please try again.");
      return;
    }

    try {
      const result = await createExchangeOrder(orderId, itemId, desiredSize, reason);
      console.log("result",result)
      if (result.success) {
        alert("Exchange request submitted successfully!");
      } else {
        alert(`Exchange request failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting exchange request:", error);
      alert(`An error occurred: ${error.message || "Please try again later."}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Exchange Policy</h2>
      <p className="text-gray-600 mb-4">
        You can request an exchange within 30 days of delivery. The item must be
        unused and in its original packaging.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium">Select New Size:</label>
        <select
          value={desiredSize}
          onChange={(e) => setDesiredSize(e.target.value)}
          className="border p-2 w-full rounded-md"
        >
          <option value="">Select Size</option>
          <option value="S">Small (S)</option>
          <option value="M">Medium (M)</option>
          <option value="L">Large (L)</option>
          <option value="XL">Extra Large (XL)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Reason for Exchange:</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border p-2 w-full rounded-md"
          placeholder="Enter reason..."
        ></textarea>
      </div>

      <button
        onClick={handleExchangeRequest}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Submit Exchange Request
      </button>
    </div>
  );
};

export default ExchangePolicy;