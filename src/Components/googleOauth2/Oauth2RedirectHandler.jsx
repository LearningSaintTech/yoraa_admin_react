import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../commonComponent/Constant';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '../slice/authslice';
import { getCurrentUser } from '../commonComponent/Api';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const getUrlParameter = (name) => {
      const searchParams = new URLSearchParams(location.search);
      return searchParams.get(name);
    };

    const parseJwt = (token) => {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    };

    const handleRedirect = async () => {
      const token = getUrlParameter('token');
      const error = getUrlParameter('error');

      if (token) {
        localStorage.setItem(ACCESS_TOKEN, token);
        dispatch(setToken(token));

        const decodedToken = parseJwt(token);
        const roles = decodedToken.roles;

        try {
          const currentUser = await getCurrentUser();
          console.log('Current User:', currentUser);
          dispatch(setUser(currentUser));
          
          if (roles.includes('ADMIN')) {
            navigate('/adminHome', { state: { from: location } });
          } else if (roles.includes('USER')) {
            navigate('/user', { state: { from: location } });
          } else {
            navigate('/login', { state: { from: location, error: "Access denied: Unauthorized role" } });
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
          navigate('/login', { state: { from: location, error: "Failed to fetch user details" } });
        }
      } else {
        navigate('/login', { state: { from: location, error: error } });
      }
    };

    handleRedirect();
  }, [navigate, location]);

  return null;
};

export default OAuth2RedirectHandler;
