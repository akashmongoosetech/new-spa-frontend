import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem('aura_admin_token');
  const userStr = localStorage.getItem('aura_admin_user');

  const isAuthenticated = Boolean(token || userStr);

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
