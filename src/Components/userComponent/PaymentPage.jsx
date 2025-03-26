import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartItems } from "../slice/cartSlice";
import { API_BASE_URL, ACCESS_TOKEN } from "../commonComponent/Constant";
import { createRazorpayOrder, verifyRazorpayPayment } from "../commonComponent/UserApi";

const PaymentGatewayScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { state } = location;
  const { itemIds, address, cart } = state || {};
const totalAmount=1;
  // Debug logs to verify received data
  console.log("Item IDs:", itemIds);
  console.log("Item address:", address);
  console.log("Item cart:", cart);
  console.log("Item totalAmount:", totalAmount);
  

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
  });

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch and parse user details from localStorage
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log("localStorage keys:", Object.keys(localStorage));
        console.log("localStorage content:", {
          USER_DATA: localStorage.getItem("USER_DATA"),
        });

        const userDataString = localStorage.getItem("USER_DATA");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserDetails({
            customerName: userData.name || "Default Name",
            email: userData.email || "default@email.com",
            phoneNumber: userData.phNo || "1234567890",
          });
        } else {
          console.warn("User data not found in localStorage. Using defaults.");
          setUserDetails({
            customerName: "Default Name",
            email: "default@email.com",
            phoneNumber: "1234567890",
          });
        }
      } catch (error) {
        console.error("Error parsing user details from localStorage:", error.message);
        setUserDetails({
          customerName: "Default Name",
          email: "default@email.com",
          phoneNumber: "1234567890",
        });
      }
    };

    fetchUserDetails();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    const token = localStorage.getItem("ACCESS_TOKEN") || ACCESS_TOKEN;
    console.log("Token:", token);

    if (!token) {
      alert("Authentication Error: User is not logged in.");
      setLoading(false);
      return;
    }

    try {
      const staticAddress = {
        address: address.address,
        city: address.city,
        country: address.country,
        firstName: address.firstName,
        lastName: address.lastName,
        phoneNumber: address.phoneNumber,
        pinCode: address.pinCode,
        state: address.state,
        type: address.type,
        _id: address._id,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
        user: address.user,
      };

      // const amountInPaisa = Math.round(totalAmount * 100);
      console.log(`tokenjiwjdiwdijeij ${token}`);

      const orderData = await createRazorpayOrder({
        amount: totalAmount,
        itemIds,
        staticAddress,
        cart,
      });
      console.log("Order Data:", orderData);

      if (!orderData.id) throw new Error("Order creation failed");

      const options = {
        key: "rzp_live_VRU7ggfYLI7DWV", // Replace with your Razorpay key
        amount: orderData.amount,
        currency: "INR",
        name: userDetails.customerName,
        description: "Order Payment",
        order_id: orderData.id,
        prefill: {
          name: userDetails.customerName,
          email: userDetails.email,
          contact: userDetails.phoneNumber,
        },
        theme: { color: "#F37254" },
        handler: async (response) => {
          try {
            const verifyData = await verifyRazorpayPayment(response);
            if (verifyData.success) {
              alert("Success: Payment successful!");
              dispatch(setCartItems([])); // Clear the cart
              navigate("/order");
            } else {
              alert("Error: Payment verification failed.");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment Verification Failed: Something went wrong.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK not loaded.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed: Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Payment Gateway</h1>

      {/* Order Summary Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h2>

        {/* Cart Items */}
        <div className="mb-4">
          <h3 className="text-base font-medium text-gray-600 mb-2">Items in Cart:</h3>
          {cart && cart.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li
                  key={`${item.item}-${item.desiredSize}`}
                  className="py-2 flex justify-between"
                >
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-12 object-contain mr-4"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.desiredSize}</p>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No items in cart.</p>
          )}
        </div>

        {/* Shipping Address */}
        <div className="mb-4">
          <h3 className="text-base font-medium text-gray-600 mb-2">Shipping Address:</h3>
          {address ? (
            <p className="text-sm text-gray-600">
              {address.firstName} {address.lastName}
              <br />
              {address.address}, {address.city}, {address.state} {address.pinCode}, {address.country}
              <br />
              Contact: {address.phoneNumber}
            </p>
          ) : (
            <p className="text-sm text-gray-500">No address provided.</p>
          )}
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center border-t pt-2">
          <h3 className="text-base font-medium text-gray-600">Total Amount:</h3>
          <p className="text-base font-semibold text-gray-800">₹{totalAmount?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* User Details Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Billing Details</h2>
        <p className="text-base text-gray-600 mb-2">
          <span className="font-semibold">Customer Name:</span>{" "}
          {userDetails.customerName || "Not available"}
        </p>
        <p className="text-base text-gray-600 mb-2">
          <span className="font-semibold">Email:</span> {userDetails.email || "Not available"}
        </p>
        <p className="text-base text-gray-600 mb-2">
          <span className="font-semibold">Phone Number:</span>{" "}
          {userDetails.phoneNumber || "Not available"}
        </p>
      </div>

      {/* Payment Button */}
      <button
        className={`w-full py-3 px-6 rounded-md text-white font-medium transition-colors duration-300 ${
          loading || !userDetails.customerName
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#F37254] hover:bg-[#e65b3d]"
        }`}
        onClick={handlePayment}
        disabled={loading || !userDetails.customerName}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ₹${totalAmount?.toLocaleString() || 0}`
        )}
      </button>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F37254]"></div>
        </div>
      )}
    </div>
  );
};

export default PaymentGatewayScreen;