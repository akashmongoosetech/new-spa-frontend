import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';
import { ProfilePage } from '../pages/ProfilePage';
import { AdminUser, BusinessSettings, NotificationItem } from '../types';
import { api } from '../services/api';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadContactsCount, setUnreadContactsCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('aura_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Global toast host for the admin console.
  useEffect(() => {
    const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
    const handleCustomToast = (e: Event) => {
      const detail = (e as CustomEvent).detail as Partial<ToastMessage> | undefined;
      if (!detail) return;
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      setToasts((prev) => [...prev, { id, type: detail.type || 'info', title: detail.title || 'Notice', ...detail }]);
    };
    window.addEventListener('aura-toast', handleCustomToast);
    return () => window.removeEventListener('aura-toast', handleCustomToast);
  }, []);

  // Validate the session against the backend and load real settings.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [me, st] = await Promise.all([
          api.getCurrentUser(),
          api.getSettings(),
        ]);
        if (cancelled) return;
        if (me) {
          setCurrentUser(me);
          localStorage.setItem('aura_admin_user', JSON.stringify(me));
        }
        if (st) {
          setSettings(st);
          setSettingsLoaded(true);
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          localStorage.removeItem('aura_admin_user');
          localStorage.removeItem('aura_admin_token');
          navigate('/admin-login');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load real badge counts + notifications for the shell.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [bList, cList, nList] = await Promise.all([
          api.getBookings(),
          api.getContactMessages(),
          api.getNotifications(),
        ]);
        if (cancelled) return;
        setPendingBookingsCount(Array.isArray(bList) ? bList.filter((b) => b && b.status === 'pending').length : 0);
        setUnreadContactsCount(Array.isArray(cList) ? cList.filter((c) => c && c.status === 'new').length : 0);
        setNotifications(Array.isArray(nList) ? nList : []);
      } catch (err) {
        // keep zero counts on failure
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Map path to AdminTab
  const getActiveTab = (): AdminTab => {
    const p = location.pathname.toLowerCase();
    if (p.includes('/bookings')) return 'bookings';
    if (p.includes('/contacts')) return 'contacts';
    if (p.includes('/therapists')) return 'therapists';
    if (p.includes('/services')) return 'services';
    if (p.includes('/calendar') || p.includes('/schedule')) return 'schedule';
    if (p.includes('/reports')) return 'reports';
    if (p.includes('/users')) return 'users';
    if (p.includes('/applications')) return 'applications';
    if (p.includes('/settings')) return 'settings';
    if (p.includes('/activity-logs')) return 'audit';
    return 'overview';
  };

  const handleSetTab = (tab: AdminTab) => {
    setMobileMenuOpen(false);
    if (tab === 'overview') navigate('/admin/dashboard');
    else if (tab === 'audit') navigate('/admin/activity-logs');
    else if (tab === 'schedule') navigate('/admin/calendar');
    else navigate(`/admin/${tab}`);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    localStorage.removeItem('aura_admin_user');
    localStorage.removeItem('aura_admin_token');
    navigate('/admin-login');
  };

  const handleUpdateCurrentUser = (u: AdminUser) => {
    setCurrentUser(u);
    localStorage.setItem('aura_admin_user', JSON.stringify(u));
  };

  const closeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleQuickAction = (action: 'add_booking' | 'add_therapist' | 'add_service') => {
    setMobileMenuOpen(false);
    if (action === 'add_booking') navigate('/admin/bookings');
    else if (action === 'add_therapist') navigate('/admin/therapists');
    else if (action === 'add_service') navigate('/admin/services/add');
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
    } catch (err) {
      // ignore
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      // ignore
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
    } catch (err) {
      // ignore
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={getActiveTab()}
        setActiveTab={handleSetTab}
        currentUser={currentUser}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        unreadContactsCount={unreadContactsCount}
        pendingBookingsCount={pendingBookingsCount}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <AdminHeader
          currentUser={currentUser}
          notifications={notifications}
          onMarkNotificationRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onClearNotification={handleClearNotification}
          onQuickAction={handleQuickAction}
          onChangePasswordClick={() => navigate('/admin/change-password')}
          onProfileClick={() => navigate('/profile')}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNavigateTab={handleSetTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          unreadContactsCount={unreadContactsCount}
          pendingBookingsCount={pendingBookingsCount}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <Outlet
            context={{
              settings,
              onUpdateSettings: setSettings,
              currentUser,
              searchQuery,
              onUpdateCurrentUser: handleUpdateCurrentUser,
            }}
          />
        </main>
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="My Profile"
        maxWidth="4xl"
      >
        <ProfilePage
          modalMode
          onClose={() => setProfileModalOpen(false)}
        />
      </Modal>

      <Toast toasts={toasts} onClose={closeToast} />
    </div>
  );
};

export default AdminLayout;