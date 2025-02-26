import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL } from '../commonComponent/Constant';
import { signup } from '../commonComponent/Api';

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        signup(formData)
            .then(() => {
                console.log("Successfully registered. Please verify your email!");
                navigate('/otp-verification', { state: { email: formData.email } });
            })
            .catch(error => {
                console.log((error && error.message) || 'Oops! Something went wrong. Please try again!');
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-md rounded-xl">
                <h1 className="text-2xl font-bold text-center text-gray-700">Signup</h1>
                <div className="flex flex-col space-y-3">
                    <a href={GOOGLE_AUTH_URL} className="py-2 text-center text-white bg-red-500 rounded-md hover:bg-red-600">Sign up with Google</a>
                    <a href={FACEBOOK_AUTH_URL} className="py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700">Sign up with Facebook</a>
                    <a href={GITHUB_AUTH_URL} className="py-2 text-center text-white bg-gray-800 rounded-md hover:bg-gray-900">Sign up with Github</a>
                </div>
                <div className="relative flex items-center justify-center">
                    <div className="w-full h-px bg-gray-300"></div>
                    <span className="absolute px-2 text-gray-500 bg-white">OR</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login!</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;
