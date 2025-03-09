import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly }) => {
    const user = useSelector(state => state.auth.user);

    if (!user) {
        return <Navigate to="/login" />;
    }

    // If `adminOnly` is true but user is not an admin, deny access
    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/notAccess" />;
    }

    // If `adminOnly` is false but user is an admin, deny access
    if (!adminOnly && user.isAdmin) {
        return <Navigate to="/notAccess" />;
    }

    return children;
};

export default ProtectedRoute;
