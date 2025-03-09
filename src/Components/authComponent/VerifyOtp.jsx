import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { auth, setupRecaptcha, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "../../firebaseConfig";

const LoginVerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { phNo } = location.state || {};

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [verificationId, setVerificationId] = useState(null);
    const inputs = useRef([]);

    useEffect(() => {
        setupRecaptcha();
        sendOtp();
    }, []);

    const sendOtp = async () => {
        try {
            const confirmation = await signInWithPhoneNumber(auth, `+91${phNo}`, window.recaptchaVerifier);
            setVerificationId(confirmation.verificationId);
            alert("OTP Sent!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Error sending OTP");
        }
    };

    const handleOtpChange = (text, index) => {
        if (isNaN(text)) return;
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const verifyOtp = async () => {
        try {
            const fullOtp = otp.join("");
            if (fullOtp.length !== 6) return alert("Enter complete OTP");

            const credential = PhoneAuthProvider.credential(verificationId, fullOtp);
            const userCredential = await signInWithCredential(auth, credential);
            const idToken = await userCredential.user.getIdToken();

            // Send idToken to backend for verification
            const response = await axios.post("https://api.yoraa.in/api/auth/verifyFirebaseOtp", {
                idToken,
                phNo: `+91${phNo}`,
            });
            console.log("response",response)
            const { token, user } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/dashboard"); // Redirect after successful verification
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Invalid OTP");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold">Verify OTP</h2>
            <p className="text-gray-600 mb-4">Enter the OTP sent to +91 {phNo}</p>

            {/* Add this div for reCAPTCHA */}
            <div id="recaptcha-container"></div>

            <div className="flex space-x-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 border border-gray-500 text-center text-xl rounded"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        ref={(input) => (inputs.current[index] = input)}
                    />
                ))}
            </div>
            <button onClick={verifyOtp} className="mt-6 bg-black text-white px-6 py-3 rounded w-full">
                Verify OTP
            </button>
        </div>
    );
};

export default LoginVerifyOtp;
