import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminDashboard } from '../AdminDashboard';
import { mockSettings } from '../../data/mockData';
import { BusinessSettings, AdminUser } from '../../types';
import { AdminTab } from '../../components/admin/AdminSidebar';

export const AdminDashboardPage: React.FC<{ initialTab?: AdminTab }> = ({ initialTab = 'overview' }) => {
  const context = useOutletContext<{
    settings?: BusinessSettings;
    onUpdateSettings?: (set: BusinessSettings) => void;
    currentUser?: AdminUser | null;
    searchQuery?: string;
  }>() || {};

  return (
    <AdminDashboard
      settings={context.settings || mockSettings}
      onUpdateSettings={context.onUpdateSettings || (() => {})}
      initialTab={initialTab}
      currentUser={context.currentUser || null}
      searchQuery={context.searchQuery || ''}
    />
  );
};

export default AdminDashboardPage;