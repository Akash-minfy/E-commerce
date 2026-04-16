import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

// Wrap any route that requires login
const ProtectedRoute = ({ children }) => {
    const { userInfo } = useStore();
    const location = useLocation();

    if (!userInfo) {
        // Redirect to login, but remember where the user was trying to go
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return children;
};

export default ProtectedRoute;
