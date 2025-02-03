import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from "../commonComponent/Api";
import { ACCESS_TOKEN, USER_DATA } from '../commonComponent/Constant';
import { setToken, setUser } from '../slice/authslice';
import '../../css/authcomponent/LoginForm.css';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      console.log("response",response.data.token)
      localStorage.setItem(ACCESS_TOKEN, response.data.token);

      dispatch(setToken(response.accessToken));

      const userData = await getCurrentUser(response.accessToken);
      localStorage.setItem(USER_DATA, JSON.stringify(userData));

      dispatch(setUser(userData));

      if (userData.isAdmin){
        navigate('/adminHome');
      } 
      // else if (userData.roles.some(role => role.name === 'USER')) {
      //   navigate('/user');
      // }
       else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            {...register('phNo', { 
              required: 'Phone number is required', 
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Enter a valid 10-digit phone number'
              }
            })}
          />
          {errors.phNo && <p className="error-message">{errors.phNo.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <button onClick={() => navigate('/signup')}>Sign up!</button></p>
    </div>
  );
};

export default LoginForm;
