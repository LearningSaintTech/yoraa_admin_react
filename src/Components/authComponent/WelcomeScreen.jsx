import React from "react";
import { FaGoogle, FaApple } from "react-icons/fa"; 
import { FcGoogle } from "react-icons/fc";

import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase Config (Replace with your own Firebase Config)
const firebaseConfig = {
  apiKey: "AIzaSyBAEJSB5QJl_0MEr13gjLzBNYxdXuUliSk",
  authDomain: "ecommerce-e038c.firebaseapp.com",
  projectId: "ecommerce-e038c",
  storageBucket: "ecommerce-e038c.appspot.com",
  messagingSenderId: "841829729642",
  appId: "1:841829729642:web:ecd6b4d97b2796617cd113",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const LoginScreen = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const firebaseIdToken = await user.getIdToken();

      console.log("Google Auth Token:", firebaseIdToken);
      console.log("User Info:", user);

      // Call backend API to store user info
      const apiResponse = await fetch("https://api.yoraa.in/api/auth/signup/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken:firebaseIdToken }),
      });

      const responseData = await apiResponse.json();

      if (apiResponse.ok) {
        const { token, user } = responseData.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        alert("Signed in successfully!");
        navigate("/home");
      } else {
        alert(responseData.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert(error.message || "An unexpected error occurred");
    }
  };

  return (
    <GoogleOAuthProvider clientId="your-web-client-id">
      <div className="flex flex-col items-center justify-center h-screen bg-white px-6">
        <h1 className="text-4xl font-bold mb-10">YORAA</h1>

        {/* Login Button */}
        <button
          className="w-full max-w-xs bg-black text-white text-lg font-semibold py-3 rounded-md mb-4"
          onClick={() => navigate("/login")}
        >
          Log In
        </button>

        {/* Sign Up Button */}
        <button
          className="w-full max-w-xs border border-black text-lg font-semibold py-3 rounded-md mb-4"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center w-full max-w-xs my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign-In Button */}
        <button
          className="w-full max-w-xs flex items-center justify-center border border-gray-300 text-lg font-semibold py-3 rounded-md mb-4"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="w-6 h-6 mr-3 text-red-500" />
          Continue with Google
        </button>

        {/* Apple Sign-In (Placeholder) */}
        <button className="w-full max-w-xs flex items-center justify-center text-white text-lg font-semibold py-3 rounded-md mb-10">
          <FaApple className="w-6 h-6 mr-3" />
          Continue with Apple
        </button>

        {/* Skip Button */}
        <button
          className="w-full max-w-xs flex items-center justify-center text-white text-lg font-semibold py-3 rounded-md mb-10 bg-black"
          onClick={() => navigate("/home")}
        >
          SKIP
        </button>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginScreen;
