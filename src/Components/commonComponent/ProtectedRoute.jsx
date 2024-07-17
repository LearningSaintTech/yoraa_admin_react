// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = useSelector(state => state.auth.user);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.status !== 'active') {
        return <Navigate to="/inactiveuser" />;
    }

    const userRoles = user.roles.map(role => role.name);
    if (!allowedRoles.some(role => userRoles.includes(role))) {
        return <Navigate to="/notAccess" />;
    }

    return children;
};

export default ProtectedRoute;
