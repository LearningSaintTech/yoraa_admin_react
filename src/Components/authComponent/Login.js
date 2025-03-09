import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from "../commonComponent/Api";
import { ACCESS_TOKEN, USER_DATA } from '../commonComponent/Constant';
import { setToken, setUser } from '../slice/authslice';
import { useDispatch } from 'react-redux';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      console.log("response",response)
      localStorage.setItem(ACCESS_TOKEN, response.data.token);
      dispatch(setToken(response.accessToken));

      const userData = await getCurrentUser(response.accessToken);
      localStorage.setItem(USER_DATA, JSON.stringify(userData));
      dispatch(setUser(userData));

      if(userData.isAdmin)
      {
        navigate('/adminHome')
      }
      else{
        navigate('/home')
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-600">Mobile No.</label>
            <input
              type="text"
              placeholder="+91"
              {...register('phNo', {
                required: 'Phone number is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit phone number' }
              })}
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-black"
            />
            {errors.phNo && <p className="text-red-500 text-sm">{errors.phNo.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              placeholder="********"
              {...register('password', { required: 'Password is required' })}
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-black"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Remember me</span>
            </div>
            <button className="text-gray-500 hover:underline">Forgot password?</button>
          </div>
          <button className="w-full py-3 text-white bg-black rounded-md">LOGIN</button>
        </form>
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-gray-300"></div>
          <span className="absolute px-4 bg-white">Or</span>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-md hover:bg-gray-100">
          <FcGoogle size={20} /> Continue with Google
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 bg-black text-white rounded-md hover:opacity-90">
          <FaApple size={20} /> Continue with Apple
        </button>
        <p className="text-center text-gray-600">
          Don't have an account? <button onClick={() => navigate('/signup')} className="text-black font-semibold hover:underline">Sign-up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;