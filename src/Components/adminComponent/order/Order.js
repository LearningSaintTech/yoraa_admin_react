import React, { useEffect, useState } from "react";
import { getAllOrder } from "../../commonComponent/Api"; // Adjust the import path if necessary
import { FaTimes } from "react-icons/fa";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrder();
      if (response.success) {
        setOrders(response.orders);
      } else {
        console.error("Failed to fetch orders:", response.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Order Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 focus:outline-none"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Order Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Order ID:
                </strong>{" "}
                <span className="text-sm text-gray-900">{order._id}</span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  User:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : "Guest"}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Total Price:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  ₹{order.total_price}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Payment Status:
                </strong>{" "}
                <span
                  className={`text-sm font-medium ${
                    order.payment_status === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.payment_status}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Shipping Status:
                </strong>{" "}
                <span
                  className={`text-sm font-medium ${
                    order.shipping_status === "Pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {order.shipping_status}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Created At:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </p>
            </div>

            {/* Payment Details */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Payment Details
              </h4>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Razorpay Order ID:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.razorpay_order_id || "N/A"}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Razorpay Payment ID:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.razorpay_payment_id || "N/A"}
                </span>
              </p>
            </div>

            {/* Shipping Details */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Shipping Details
              </h4>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Tracking URL:
                </strong>{" "}
                {order.tracking_url ? (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Track Order
                  </a>
                ) : (
                  <span className="text-sm text-gray-600">Not Available</span>
                )}
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Shiprocket Order ID:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.shiprocket_orderId || "N/A"}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Shipment ID:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.shiprocket_shipment_id || "N/A"}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  AWB Code:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.awb_code || "N/A"}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Courier Name:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.courier_name || "N/A"}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Freight Charges:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.freight_charges ? `₹${order.freight_charges}` : "N/A"}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Invoice No:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.invoice_no || "N/A"}
                </span>
              </p>
            </div>

            {/* Items */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Items</h4>
              {order.items.length > 0 ? (
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="border rounded-md p-2 bg-gray-50 text-sm text-gray-900"
                    >
                      <strong>{item.name}</strong> - ₹{item.price}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No items found.</p>
              )}
              {order.item_quantities.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-md font-semibold text-gray-700 mb-1">
                    Quantities:
                  </h5>
                  <ul className="space-y-1">
                    {order.item_quantities.map((qty, index) => (
                      <li
                        key={qty._id}
                        className="text-sm text-gray-600"
                      >
                        Item {index + 1}: {qty.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Shipping Address
              </h4>
              <p className="text-sm text-gray-900">
                {order.address?.firstName} {order.address?.lastName},{" "}
                {order.address?.address}, {order.address?.city},{" "}
                {order.address?.state} - {order.address?.pinCode},{" "}
                {order.address?.country}
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Phone:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.address?.phoneNumber || "N/A"}
                </span>
              </p>
            </div>

            {/* Shipper Details */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Shipper Details
              </h4>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Company:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.shipped_by?.shipper_company_name || "N/A"}
                </span>
              </p>
              <p className="text-sm text-gray-900">
                {order.shipped_by?.shipper_address_1},{" "}
                {order.shipped_by?.shipper_address_2 && (
                  <>
                    {order.shipped_by.shipper_address_2},{" "}
                  </>
                )}
                {order.shipped_by?.shipper_city},{" "}
                {order.shipped_by?.shipper_state},{" "}
                {order.shipped_by?.shipper_country} -{" "}
                {order.shipped_by?.shipper_postcode}
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Phone:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.shipped_by?.shipper_phone || "N/A"}
                </span>
              </p>
              <p>
                <strong className="text-sm font-medium text-gray-700">
                  Email:
                </strong>{" "}
                <span className="text-sm text-gray-900">
                  {order.shipped_by?.shipper_email || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Orders
        </h1>
        {/* No "Add" button needed for Orders, keeping layout consistent */}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Shipping Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Created At
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : "Guest"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{order.total_price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.payment_status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.shipping_status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openModal(order)}
                          className="inline-flex items-center rounded-md border border-transparent bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        >
                          ℹ️ Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
      )}
    </div>
  );
};

export default Order;