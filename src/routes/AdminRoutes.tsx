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
const AdminUsersPage = lazy(() => import('../pages/Admin/AdminUsersPage'));
const AdminSettingsPage = lazy(() => import('../pages/Admin/AdminSettingsPage'));
const AdminSeoPage = lazy(() => import('../pages/Admin/AdminSeoPage'));
const AdminEmailTemplatesPage = lazy(() => import('../pages/Admin/AdminEmailTemplatesPage'));
const AdminProfilePage = lazy(() => import('../pages/Admin/AdminProfilePage'));
const AdminChangePasswordPage = lazy(() => import('../pages/Admin/AdminChangePasswordPage'));
const AdminActivityLogsPage = lazy(() => import('../pages/Admin/AdminActivityLogsPage'));

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
    <Route index element={<AdminDashboardPage />} />
    <Route path="dashboard" element={<AdminDashboardPage />} />
    <Route path="bookings" element={<AdminBookingsPage />} />
    <Route path="contacts" element={<AdminContactsPage />} />
    <Route path="services" element={<AdminServicesPage />} />
    <Route path="services/add" element={<AdminServiceFormPage />} />
    <Route path="services/edit/:id" element={<AdminServiceFormPage />} />
    <Route path="therapists" element={<AdminTherapistsPage />} />
    <Route path="therapists/add" element={<AdminTherapistFormPage />} />
    <Route path="therapists/edit/:id" element={<AdminTherapistFormPage />} />
    <Route path="calendar" element={<AdminCalendarPage />} />
    <Route path="reports" element={<AdminDashboardPage initialTab="reports" />} />
    <Route path="blogs" element={<AdminBlogsPage />} />
    <Route path="blogs/add" element={<AdminBlogFormPage />} />
    <Route path="blogs/edit/:id" element={<AdminBlogFormPage />} />
    <Route path="gallery" element={<AdminGalleryPage />} />
    <Route path="testimonials" element={<AdminTestimonialsPage />} />
    <Route path="faqs" element={<AdminFaqsPage />} />
    <Route path="users" element={<AdminUsersPage />} />
    <Route path="settings" element={<AdminSettingsPage />} />
    <Route path="seo" element={<AdminSeoPage />} />
    <Route path="email-templates" element={<AdminEmailTemplatesPage />} />
    <Route path="profile" element={<AdminProfilePage />} />
    <Route path="change-password" element={<AdminChangePasswordPage />} />
    <Route path="activity-logs" element={<AdminActivityLogsPage />} />
  </Route>
);

export default renderAdminRoutes;
