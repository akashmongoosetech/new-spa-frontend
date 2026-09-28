import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const AdminDashboardPage = lazy(() => import('../pages/Admin/AdminDashboardPage'));
const AdminBookingsPage = lazy(() => import('../pages/Admin/AdminBookingsPage'));
const AdminContactsPage = lazy(() => import('../pages/Admin/AdminContactsPage'));
const AdminServicesPage = lazy(() => import('../pages/Admin/AdminServicesPage'));
const AdminServiceFormPage = lazy(() => import('../pages/Admin/AdminServiceFormPage'));
const AdminTherapistsPage = lazy(() => import('../pages/Admin/AdminTherapistsPage'));
const AdminTherapistFormPage = lazy(() => import('../pages/Admin/AdminTherapistFormPage'));
const AdminCalendarPage = lazy(() => import('../pages/Admin/AdminCalendarPage'));
const AdminBlogsPage = lazy(() => import('../pages/Admin/AdminBlogsPage'));
const AdminBlogFormPage = lazy(() => import('../pages/Admin/AdminBlogFormPage'));
const AdminGalleryPage = lazy(() => import('../pages/Admin/AdminGalleryPage'));
const AdminTestimonialsPage = lazy(() => import('../pages/Admin/AdminTestimonialsPage'));
const AdminFaqsPage = lazy(() => import('../pages/Admin/AdminFaqsPage'));
const AdminCouponsPage = lazy(() => import('../pages/Admin/AdminCouponsPage'));
const AdminEmailLogsPage = lazy(() => import('../pages/Admin/AdminEmailLogsPage'));
const AdminUsersPage = lazy(() => import('../pages/Admin/AdminUsersPage'));
const AdminApplicationsPage = lazy(() => import('../pages/Admin/AdminApplicationsPage'));
const AdminSettingsPage = lazy(() => import('../pages/Admin/AdminSettingsPage'));
const AdminSeoPage = lazy(() => import('../pages/Admin/AdminSeoPage'));
const AdminEmailTemplatesPage = lazy(() => import('../pages/Admin/AdminEmailTemplatesPage'));
const AdminProfilePage = lazy(() => import('../pages/Admin/AdminProfilePage'));
const AdminChangePasswordPage = lazy(() => import('../pages/Admin/AdminChangePasswordPage'));
const AdminActivityLogsPage = lazy(() => import('../pages/Admin/AdminActivityLogsPage'));

const ALL_STAFF = ['Super Admin', 'Admin', 'Manager', 'Receptionist'];
const MANAGER_UP = ['Super Admin', 'Admin', 'Manager'];
const ADMIN_ONLY = ['Super Admin', 'Admin'];
const SUPER_ONLY = ['Super Admin'];

export const renderAdminRoutes = () => (
  <Route
    path="admin"
    element={
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner fullScreen label="Loading administration console..." />}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    }
  >
    <Route index element={<ProtectedRoute roles={ALL_STAFF}><AdminDashboardPage /></ProtectedRoute>} />
    <Route path="dashboard" element={<ProtectedRoute roles={ALL_STAFF}><AdminDashboardPage /></ProtectedRoute>} />
    <Route path="bookings" element={<ProtectedRoute roles={ALL_STAFF}><AdminBookingsPage /></ProtectedRoute>} />
    <Route path="contacts" element={<ProtectedRoute roles={ALL_STAFF}><AdminContactsPage /></ProtectedRoute>} />
    <Route path="services" element={<ProtectedRoute roles={MANAGER_UP}><AdminServicesPage /></ProtectedRoute>} />
    <Route path="services/add" element={<ProtectedRoute roles={MANAGER_UP}><AdminServiceFormPage /></ProtectedRoute>} />
    <Route path="services/edit/:id" element={<ProtectedRoute roles={MANAGER_UP}><AdminServiceFormPage /></ProtectedRoute>} />
    <Route path="therapists" element={<ProtectedRoute roles={MANAGER_UP}><AdminTherapistsPage /></ProtectedRoute>} />
    <Route path="therapists/add" element={<ProtectedRoute roles={MANAGER_UP}><AdminTherapistFormPage /></ProtectedRoute>} />
    <Route path="therapists/edit/:id" element={<ProtectedRoute roles={MANAGER_UP}><AdminTherapistFormPage /></ProtectedRoute>} />
    <Route path="calendar" element={<ProtectedRoute roles={ALL_STAFF}><AdminCalendarPage /></ProtectedRoute>} />
    <Route path="reports" element={<ProtectedRoute roles={MANAGER_UP}><AdminDashboardPage initialTab="reports" /></ProtectedRoute>} />
    <Route path="blogs" element={<ProtectedRoute roles={MANAGER_UP}><AdminBlogsPage /></ProtectedRoute>} />
    <Route path="blogs/add" element={<ProtectedRoute roles={MANAGER_UP}><AdminBlogFormPage /></ProtectedRoute>} />
    <Route path="blogs/edit/:id" element={<ProtectedRoute roles={MANAGER_UP}><AdminBlogFormPage /></ProtectedRoute>} />
    <Route path="gallery" element={<ProtectedRoute roles={ADMIN_ONLY}><AdminGalleryPage /></ProtectedRoute>} />
    <Route path="testimonials" element={<ProtectedRoute roles={ADMIN_ONLY}><AdminTestimonialsPage /></ProtectedRoute>} />
    <Route path="faqs" element={<ProtectedRoute roles={MANAGER_UP}><AdminFaqsPage /></ProtectedRoute>} />
    <Route path="coupons" element={<ProtectedRoute roles={MANAGER_UP}><AdminCouponsPage /></ProtectedRoute>} />
    <Route path="email-logs" element={<ProtectedRoute roles={ADMIN_ONLY}><AdminEmailLogsPage /></ProtectedRoute>} />
    <Route path="users" element={<ProtectedRoute roles={ADMIN_ONLY}><AdminUsersPage /></ProtectedRoute>} />
    <Route path="applications" element={<ProtectedRoute roles={SUPER_ONLY}><AdminApplicationsPage /></ProtectedRoute>} />
    <Route path="settings" element={<ProtectedRoute roles={ADMIN_ONLY}><AdminSettingsPage /></ProtectedRoute>} />
    <Route path="seo" element={<ProtectedRoute roles={ADMIN_ONLY}><AdminSeoPage /></ProtectedRoute>} />
    <Route path="email-templates" element={<ProtectedRoute roles={ADMIN_ONLY}><AdminEmailTemplatesPage /></ProtectedRoute>} />
    <Route path="profile" element={<ProtectedRoute roles={ALL_STAFF}><AdminProfilePage /></ProtectedRoute>} />
    <Route path="change-password" element={<ProtectedRoute roles={ALL_STAFF}><AdminChangePasswordPage /></ProtectedRoute>} />
    <Route path="activity-logs" element={<ProtectedRoute roles={ADMIN_ONLY}><AdminActivityLogsPage /></ProtectedRoute>} />
  </Route>
);

export default renderAdminRoutes;
