import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // Redirect to home if user is not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
