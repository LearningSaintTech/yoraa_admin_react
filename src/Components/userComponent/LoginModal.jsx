import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const LoginModal = ({ isOpen, onClose }) => {
  // ✅ Hooks should always be called at the top level
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null; // ✅ Now it's safe to conditionally return null

  const handleLogin = () => {
    console.log("Logging in with:", { mobile, password });
    // Add your login logic here
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <IoClose size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">LOG IN</h2>
        <input
          type="text"
          placeholder="MOBILE NO."
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border p-2 mb-3"
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-600"
          >
            👁
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2 cursor-pointer">
          FORGOT PASSWORD?
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 mt-4"
        >
          LOG IN
        </button>
        <button className="w-full border p-2 mt-2">CREATE ACCOUNT</button>
      </div>
    </div>
  );
};

export default LoginModal;
