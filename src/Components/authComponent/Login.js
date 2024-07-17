import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from "../commonComponent/Api";
import { ACCESS_TOKEN, USER_DATA } from '../commonComponent/Constant';
import { setToken, setUser } from '../slice/authslice';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL } from "../commonComponent/Constant";
import '../../css/authcomponent/LoginForm.css';
import { useSelector, useDispatch } from 'react-redux';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem(ACCESS_TOKEN, response.accessToken);

      dispatch(setToken(response.accessToken));

      const userData = await getCurrentUser(response.accessToken);
      localStorage.setItem(USER_DATA, userData);

      dispatch(setUser(userData));

      if (userData.roles.some(role => role.name === 'ADMIN')) {
        navigate('/adminHome');
      } else if (userData.roles.some(role => role.name === 'USER')) {
        navigate('/user');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <div className="social-login">
        <a href={GOOGLE_AUTH_URL}>Log in with Google</a>
        <a href={FACEBOOK_AUTH_URL}>Log in with Facebook</a>
        <a href={GITHUB_AUTH_URL}>Log in with Github</a>
      </div>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
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

      {/* Render SignupForm component */}
    </div>
  );
};

export default LoginForm;
