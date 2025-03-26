import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrdersByUser } from '../../commonComponent/UserApi'; // Adjust path as needed

const OrderScreen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrdersByUser();
      console.log('response orders ', response);

      if (response.success) {
        if (response.orders && response.orders.length > 0) {
          setOrders(response.orders);
        } else {
          alert('No orders found.');
        }
      } else {
        alert('Failed to fetch orders.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F5]">
      {/* Back Icon and Title */}
      <div className="flex items-center p-5 border-b border-gray-200">
        {/* <button
          className="p-0 bg-transparent border-none cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src={require('../assests/images/BackArrow.png')}
            alt="Back"
            className="w-6 h-6"
          />
        </button> */}
        <h2 className="flex-1 text-center text-xl font-bold">TRACK ORDER</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex justify-center items-center flex-1">
          <p className="text-lg text-gray-600 font-bold">No orders available</p>
        </div>
      ) : (
        <div className="p-4 overflow-y-auto">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-600 mb-4">
            <div>PRODUCT</div>
            <div className="text-center">QUANTITY</div>
            <div className="text-right">TOTAL</div>
            <div className="text-right">TRACK</div>
          </div>

          {/* Order Items */}
          {orders.map((order) =>
            order.items.map((product, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 border-b border-gray-200 py-4">
                {/* Product Column */}
                <div className="flex items-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 mr-2.5 rounded object-contain"
                  />
                  <div>
                    <p className="text-sm text-gray-700 font-semibold">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.description}</p>
                    <p className="text-xs text-gray-500">PINK</p> {/* Hardcoded as per image */}
                    <p className="text-xs text-gray-500 mt-1">Tracking ID: #{order.awb_code}</p>
                  </div>
                </div>

                {/* Quantity Column */}
                <div className="flex justify-center items-center">
                  <div className="flex items-center border rounded">
                    <button className="px-2 py-1 text-gray-600">-</button>
                    <input
                      type="text"
                      value="1"
                      readOnly
                      className="w-12 text-center border-x px-2 py-1"
                    />
                    <button className="px-2 py-1 text-gray-600">+</button>
                  </div>
                </div>

                {/* Total Column */}
                <div className="flex items-center justify-end">
                  <p className="text-sm font-semibold">Rs. {order.total_price.toLocaleString()}</p>
                </div>

                {/* Track Column */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() =>
                      navigate('/tracking', {
                        state: {
                          awbCode: order.awb_code,
                          address: order.address,
                          imageUrl: product.imageUrl,
                          productName: product.name,
                          description: product.description,
                          orderPlaced: order.created_at,
                          orderId: order._id,
                          trackingUrl: order.tracking_url,
                          shippingStatus: order.shipping_status,
                          paymentStatus: order.payment_status,
                          itemId:order.items[0]._id
                        },
                      })
                    }
                    className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition-colors duration-300"
                  >
                    TRACK ORDER
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderScreen;