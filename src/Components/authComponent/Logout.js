import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../slice/authslice';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logout());
        navigate('/login');
    }, [dispatch, navigate]);

    return (
        <div>
            Logging out...
        </div>
    );
};

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return handleLogout;
};

export default Logout;
