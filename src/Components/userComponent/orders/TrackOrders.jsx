import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaShippingFast, FaEllipsisV } from 'react-icons/fa';
import { API_BASE_URL } from '../../commonComponent/Constant';

const milestoneSteps = [
  { label: "Order Placed", status: "OP" },
  { label: "Picked Up", status: "PKD" },
  { label: "In Transit", status: "X-PPOM" },
  { label: "Reached at Destination", status: "RAD" },
  { label: "Out for Delivery", status: "OFD" },
  { label: "Delivered", status: "DLVD" },
];

const TrackingOrderScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { awbCode, address, orderPlaced, imageUrl, orderId, productName, description,itemId } = location.state || {};

  const [trackingData, setTrackingData] = useState(null);
  const [trackingData1, setTrackingData1] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  console.log("orderId", orderId);
  console.log("itemId", itemId);


  useEffect(() => {
    authenticateAndFetchTracking();
  }, []);

  const authenticateAndFetchTracking = async () => {
    try {
      setLoading(true);
      const authResponse = await fetch(`${API_BASE_URL}/api/orders/shiprocket/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const authData = await authResponse.json();
      if (!authResponse.ok || !authData.token) {
        throw new Error("Authentication failed.");
      }
      const authToken = authData.token;
      setToken(authToken);

      const trackingResponse = await fetch(`${API_BASE_URL}/api/orders/shiprocket/track/${awbCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const trackingData = await trackingResponse.json();
      if (!trackingResponse.ok || !trackingData.data.tracking_data) {
        throw new Error("Tracking data not available.");
      }
      setTrackingData(trackingData.data.tracking_data);
      setTrackingData1(trackingData.data);
    } catch (error) {
      console.error("Error authenticating or fetching tracking data:", error);
      alert("Failed to fetch tracking details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/cancel/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Order canceled successfully:", data);
    } catch (error) {
      console.error("Error canceling order:", error.message);
    } finally {
      setModalVisible(false);
    }
  };

  const handleRefundExchangeRequest = (type) => {
    console.log(`${type} requested`);
    if (type === 'Exchange') {
      navigate('/exchange-policy', { state: { orderId, itemId } });
    } else if (type === 'Refund') {
      console.log('Refund logic to be implemented');
    }
    setDropdownVisible(false);
  };

  console.log("trackingdata1", trackingData1);

  // Derive completed statuses based solely on shipment_status
  let completedStatuses = [];

  const shipmentStatus = trackingData1?.tracking_data?.shipment_status;
  console.log("shipmentStatus", shipmentStatus);

  // Map Shiprocket shipment_status to milestone status
  const statusMapping = {
    52: "OP", // Shipment Booked
    19: "PKD", 27: "PKD", 42: "PKD", // Picked Up
    18: "X-PPOM", 46: "X-PPOM", 50: "X-PPOM", 54: "X-PPOM", // In Transit
    38: "RAD", 48: "RAD", 56: "RAD", 78: "RAD", // Reached at Destination
    17: "OFD", 41: "OFD", // Out for Delivery
    7: "DLVD", 10: "DLVD", 23: "DLVD", // Delivered
  };

  // Determine the current milestone based on shipment_status
  const currentMilestone = shipmentStatus ? (statusMapping[shipmentStatus] || "OP") : "OP";
  console.log("currentMilestone", currentMilestone);

  // Include all milestones up to the current one
  const milestoneOrder = ["OP", "PKD", "X-PPOM", "RAD", "OFD", "DLVD"];
  const currentIndex = milestoneOrder.indexOf(currentMilestone);
  console.log("currentIndex", currentIndex);

  completedStatuses = currentIndex >= 0 ? milestoneOrder.slice(0, currentIndex + 1) : ["OP"];
  console.log("completedStatuses", completedStatuses);

  const visibleMilestones = milestoneSteps.filter(step => completedStatuses.includes(step.status));
  console.log("visibleMilestones", visibleMilestones);

  // Check if the order is eligible for refund/exchange (delivered within 30 days)
  const isEligibleForRefundExchange = () => {
    if (!trackingData?.shipment_track[0]?.delivered_date) return false;
    const deliveredDate = new Date(trackingData.shipment_track[0].delivered_date);
    const currentDate = new Date();
    const daysSinceDelivery = (currentDate - deliveredDate) / (1000 * 60 * 60 * 24);
    return daysSinceDelivery <= 30 && !trackingData1?.returnStatus; // Assuming returnStatus is set if a return is in progress
  };

  if (loading || !trackingData1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 relative">
        <button onClick={() => navigate(-1)} className="p-0 bg-transparent border-none cursor-pointer">
          <FaArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold">TRACK ORDER</h2>
        {/* More Options Button in Upper Right */}
        {isEligibleForRefundExchange() && (
          <div className="relative">
            <button
              onClick={() => setDropdownVisible(!dropdownVisible)}
              className="p-2 bg-transparent border-none cursor-pointer"
            >
              <FaEllipsisV className="w-5 h-5 text-black" />
            </button>
            {dropdownVisible && (
              <div className="absolute right-0 top-10 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  onClick={() => handleRefundExchangeRequest('Refund')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Refund
                </button>
                <button
                  onClick={() => handleRefundExchangeRequest('Exchange')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Exchange
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Product Info */}
        <div className="flex mb-4 pb-4 border-b border-gray-200">
          <img src={imageUrl} alt={productName} className="w-24 h-24 rounded object-contain" />
          <div className="ml-4 flex-1">
            <p className="text-lg font-bold">Product: {productName}</p>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            <p className="text-sm text-gray-800 mt-1">
              Tracking ID: <span className="font-bold">#{awbCode}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {trackingData && trackingData.shipment_track[0].delivered_date
                ? `Delivered on: ${new Date(trackingData.shipment_track[0].delivered_date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).replace(/ GMT.*$/, "")}`
                : trackingData && trackingData.etd
                  ? `Estimated Delivery: ${new Date(trackingData.etd).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).replace(/ GMT.*$/, "")}`
                  : "Delivery date not available"}
            </p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">DELIVER TO</h3>
          <p className="text-sm text-gray-600">
            {address
              ? `${address.firstName} ${address.lastName}, ${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.pinCode}`
              : "Address not available"}
          </p>
          <p className="text-sm text-gray-600 mt-1">{address?.phoneNumber || "Phone number not available"}</p>
        </div>

        {/* Tracking Milestones */}
        <div className="mb-4">
          {milestoneSteps.map((step, index) => {
            const trackingStatuses = completedStatuses || [];
            const latestIndex = milestoneSteps
              .map(s => s.status)
              .reduce((maxIndex, status, i) => (trackingStatuses.includes(status) ? i : maxIndex), -1);
            const isCompleted = step.status === "OP" || index <= latestIndex;

            return (
              <div key={index} className="flex items-start mb-3">
                <div className="flex flex-col items-center mr-3">
                  <div className={`w-3 h-3 rounded-full ${isCompleted ? "bg-cyan-300" : "bg-black"}`}></div>
                  {index < milestoneSteps.length - 1 && (
                    <div className="w-0.5 h-5 bg-gray-400 mt-1"></div>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-bold ${isCompleted ? "text-black" : "text-gray-600"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step.status === "OP"
                      ? new Date(orderPlaced).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : step.status === "DLVD" && trackingData?.shipment_track[0]?.delivered_date
                      ? new Date(trackingData.shipment_track[0].delivered_date).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        }).replace(/ GMT.*$/, "")
                      : isCompleted
                      ? "Completed"
                      : "Pending"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancel Order Button */}
        {trackingData1?.tracking_data?.shipment_status !== 7 && // Delivered
         trackingData1?.tracking_data?.shipment_status !== 8 && // Canceled
         trackingData1?.tracking_data?.shipment_status !== 10 && // RTO Delivered
         trackingData1?.tracking_data?.shipment_status !== 23 && // Partial_Delivered
         trackingData1?.tracking_data?.shipment_status !== 45 && // Cancelled Before Dispatched
         trackingData1?.tracking_data?.shipment_status !== 47 && // QC Failed
         trackingData1?.tracking_data?.shipment_status !== 25 && // Damaged
         trackingData1?.tracking_data?.shipment_status !== 24 && // Destroyed
         trackingData1?.tracking_data?.shipment_status !== 12 && // Lost
         trackingData1?.tracking_data?.shipment_status !== 76 && // Untraceable
         trackingData1?.tracking_data?.shipment_status !== 44 && // Disposed Off
         trackingData1?.tracking_data?.shipment_status !== 21 && // Undelivered
         trackingData1?.tracking_data?.shipment_status !== 22 && // Delayed
         trackingData1?.tracking_data?.shipment_status !== 13 && // Pickup Error
         trackingData1?.tracking_data?.shipment_status !== 20 && // Pickup Exception
         trackingData1?.tracking_data?.shipment_status !== 71 && // Handover Exception
         trackingData1?.tracking_data?.shipment_status !== 72 && // Packed Exception
         trackingData1?.tracking_data?.shipment_status !== 75 && // RTO_LOCK
         trackingData1?.tracking_data?.shipment_status !== 77 && // Issue Related to Recipient
         trackingData1?.tracking_data?.shipment_status !== 40 && // RTO_NDR
         trackingData1?.tracking_data?.shipment_status !== 9 && // RTO Initiated
         trackingData1?.tracking_data?.shipment_status !== 14 && // RTO Acknowledged
         trackingData1?.tracking_data?.shipment_status !== 15 && // Pickup Rescheduled
         trackingData1?.tracking_data?.shipment_status !== 16 && // Cancellation Requested
         trackingData1?.tracking_data?.shipment_status !== 39 && // Misrouted
         trackingData1?.tracking_data?.shipment_status !== 49 && // Custom Cleared
         trackingData1?.tracking_data?.shipment_status !== 51 && // Handover to Courier
         trackingData1?.tracking_data?.shipment_status !== 55 && // Connection Aligned
         trackingData1?.tracking_data?.shipment_status !== 57 && // Custom Cleared Overseas
         trackingData1?.tracking_data?.shipment_status !== 59 && // Box Packing
         trackingData1?.tracking_data?.shipment_status !== 60 && // FC Allocated
         trackingData1?.tracking_data?.shipment_status !== 61 && // Picklist Generated
         trackingData1?.tracking_data?.shipment_status !== 62 && // Ready To Pack
         trackingData1?.tracking_data?.shipment_status !== 63 && // Packed
         trackingData1?.tracking_data?.shipment_status !== 67 && // FC Manifest Generated
         trackingData1?.tracking_data?.shipment_status !== 68 && // Processed at Warehouse
         trackingData1?.tracking_data?.shipment_status !== 43 && // Self Fulfilled
         trackingData1?.tracking_data?.shipment_status !== 26 && // Fulfilled
         trackingData1?.tracking_data?.shipment_status !== 6 && // Shipped
         (
          <button
            onClick={() => setModalVisible(true)}
            className="w-full border border-black py-3.5 px-4 text-center text-base font-bold uppercase text-black rounded-lg hover:bg-gray-100 transition-colors duration-300 mb-4"
          >
            CANCEL ORDER
          </button>
        )}

        {/* Track Order Button */}
        {!loading && (
          <button
            onClick={() =>
              trackingData && trackingData.track_url
                ? window.open(trackingData.track_url, "_blank")
                : alert("Tracking URL not available.")
            }
            className="flex items-center justify-center w-full bg-black text-white py-5 px-4 hover:bg-gray-800 transition-colors duration-300 mb-4"
          >
            <FaShippingFast className="mr-2" />
            <span className="text-base font-bold">TRACK ORDER</span>
          </button>
        )}

        {/* Modal for Cancel Confirmation */}
        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg">
              <p className="text-lg font-bold mb-5">Are you sure you want to cancel the order?</p>
              <div className="flex justify-between">
                <button
                  onClick={handleCancelOrder}
                  className="bg-green-600 text-white px-5 py-2.5 rounded hover:bg-green-700 transition-colors duration-300"
                >
                  Yes
                </button>
                <button
                  onClick={() => setModalVisible(false)}
                  className="bg-gray-500 text-white px-5 py-2.5 rounded hover:bg-gray-600 transition-colors duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingOrderScreen;