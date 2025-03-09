import React, { useState } from "react";
import { signup } from "../commonComponent/Api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phNo: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.phNo || !formData.password) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phNo)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting signup request", formData);
      await signup({ name: formData.name, phNo: formData.phNo, password: formData.password });
      console.log("Signup Successful");

      navigate("/verify-otp", { state: { phNo: formData.phNo } });
    } catch (error) {
      console.error("Signup Error:", error);
      setError(error.message || "Signup failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className="w-full max-w-sm">
        <button className="text-black text-2xl mb-6">←</button>
        <h1 className="text-4xl font-bold mb-6 text-center">Sign-up</h1>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative border-b border-gray-300">
            <label className="absolute top-2 left-0 text-gray-500 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pt-6 pb-2 focus:outline-none"
            />
          </div>
          <div className="relative border-b border-gray-300">
            <label className="absolute top-2 left-0 text-gray-500 text-sm">Mobile No.</label>
            <input
              type="text"
              name="phNo"
              value={formData.phNo}
              onChange={handleChange}
              className="w-full pt-6 pb-2 focus:outline-none"
            />
          </div>
          <div className="relative border-b border-gray-300">
            <label className="absolute top-2 left-0 text-gray-500 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pt-6 pb-2 focus:outline-none"
            />
          </div>
          <div className="relative border-b border-gray-300">
            <label className="absolute top-2 left-0 text-gray-500 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pt-6 pb-2 focus:outline-none"
            />
          </div>
          <div id="recaptcha-container"></div>
          <p className="text-center text-gray-500 text-sm mt-2">
            Already have an account? <span className="text-black font-semibold cursor-pointer">Login</span>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md mt-4"
          >
            {loading ? "Signing up..." : "SIGN-UP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
