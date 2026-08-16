import React from 'react';
import { AdminDashboardPage } from './AdminDashboardPage';

export const AdminBookingsPage: React.FC = () => {
  return <AdminDashboardPage initialTab="bookings" />;
};

export default AdminBookingsPage;
