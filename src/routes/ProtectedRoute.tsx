import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function hasValidTokenFormat(token: string | null): boolean {
  if (!token) return false;
  // JWT must have 3 parts; stale user-only sessions no longer pass.
  return token.split('.').length === 3;
}

export const ProtectedRoute: React.FC<{ children?: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const location = useLocation();

  const token = localStorage.getItem('aura_admin_token');
  if (!hasValidTokenFormat(token)) {
    localStorage.removeItem('aura_admin_token');
    localStorage.removeItem('aura_admin_user');
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    try {
      const user = JSON.parse(localStorage.getItem('aura_admin_user') || 'null');
      const role = user?.role;
      if (!role || !roles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
      }
    } catch {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
