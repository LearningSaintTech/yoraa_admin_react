import React, { useState } from 'react';
import { loadRazorpayScript } from '../../commonComponent/Api'; // A helper to load Razorpay script

const AdminDashboard = () => {
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load Razorpay SDK. Please try again.");
        return;
      }

      // Call your backend to create an order
      const orderResponse = await fetch('http://localhost:8080/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: form.amount }),
      });


      const orderData = await orderResponse.json();

      // Razorpay payment options
      const options = {
        key: "rzp_live_ZumwCLoX1AZdm9", // Replace with your Razorpay Key ID
        amount: orderData.amount, // Amount in paise
        currency: "INR",
        name: form.customerName,
        description: "Order Payment",
        order_id: orderData.id, // Razorpay order ID
        handler: function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          // Send payment details to your backend for verification
          fetch('http://localhost:8080//api/razorpay/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                alert("Payment successful!");
              } else {
                alert("Payment verification failed. Please try again.");
              }
            });
        },
        prefill: {
          name: form.customerName,
          email: form.email,
          contact: form.phoneNumber,
        },
        theme: {
          color: "#F37254",
        },
      };

      // Open Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.log(error);
      alert("Something went wrong with the payment process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handlePayment}>
        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
