import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { renderPublicRoutes } from './PublicRoutes';
import { renderAdminRoutes } from './AdminRoutes';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { RouteMetadataManager } from '../components/ui/RouteMetadataManager';
import { ProtectedRoute } from './ProtectedRoute';

const AdminLoginPage = lazy(() => import('../pages/Auth/AdminLoginPage'));
const AdminSignupPage = lazy(() => import('../pages/Auth/AdminSignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/Auth/ResetPasswordPage'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <RouteMetadataManager />
      <Routes>
        {/* Public Routes */}
        {renderPublicRoutes()}

        {/* Protected User/Manager/Admin Routes */}
        
        {/* Auth Routes */}
        <Route
          element={
            <Suspense fallback={<LoadingSpinner fullScreen label="Securing session..." />}>
              <AuthLayout />
            </Suspense>
          }
        >
          <Route path="admin-login" element={<AdminLoginPage />} />
          <Route path="admin-signup" element={<AdminSignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Admin Routes */}
        {renderAdminRoutes()}

        {/* Error & Fallback Routes */}
        <Route
          path="unauthorized"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Unauthorized />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
