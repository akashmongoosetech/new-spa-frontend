import React from 'react';
import { AdminDashboardPage } from './AdminDashboardPage';

export const AdminActivityLogsPage: React.FC = () => {
  return <AdminDashboardPage initialTab="audit" />;
};

export default AdminActivityLogsPage;
