import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from "../commonComponent/Api";
import { ACCESS_TOKEN, USER_DATA } from '../commonComponent/Constant';
import { setToken, setUser } from '../slice/authslice';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem(ACCESS_TOKEN, response.data.token);
      dispatch(setToken(response.accessToken));

      const userData = await getCurrentUser(response.accessToken);
      localStorage.setItem(USER_DATA, JSON.stringify(userData));
      dispatch(setUser(userData));

      userData.isAdmin ? navigate('/adminHome') : navigate('/login');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-600">Phone Number</label>
            <input
              type="text"
              {...register('phNo', { 
                required: 'Phone number is required', 
                pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit phone number' }
              })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.phNo && <p className="text-red-500 text-sm">{errors.phNo.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="text-center text-gray-600">
          Don't have an account? <button onClick={() => navigate('/signup')} className="text-blue-500 hover:underline">Sign up!</button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
