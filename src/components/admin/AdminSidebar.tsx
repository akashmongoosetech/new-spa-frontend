import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Sparkles,
  Settings,
  Shield,
  FileText,
  Clock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Award,
  Lock,
  X,
  UserPlus
} from 'lucide-react';
import { AdminUser } from '../../types';

export type AdminTab =
  | 'overview'
  | 'bookings'
  | 'contacts'
  | 'therapists'
  | 'services'
  | 'schedule'
  | 'users'
  | 'applications'
  | 'settings'
  | 'reports'
  | 'audit';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  currentUser: AdminUser | null;
  collapsed: boolean;
  setCollapsed: (col: boolean) => void;
  unreadContactsCount: number;
  pendingBookingsCount: number;
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const normalizeRole = (role?: string) =>
  (role || 'admin').toLowerCase().replace(/\s+/g, '_');

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  collapsed,
  setCollapsed,
  unreadContactsCount,
  pendingBookingsCount,
  onLogout,
  mobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const role = normalizeRole(currentUser?.role);
  // Mobile drawer always shows the full expanded menu regardless of collapse state.
  const isCollapsed = collapsed && !mobileOpen;

  // Role-based visibility check
  const isAllowed = (tab: AdminTab) => {
    if (tab === 'applications') return role === 'super_admin';
    if (role === 'super_admin' || role === 'admin') return true;
    if (role === 'manager') {
      return ['overview', 'bookings', 'contacts', 'therapists', 'services', 'schedule', 'reports'].includes(tab);
    }
    if (role === 'receptionist') {
      return ['overview', 'bookings', 'contacts', 'schedule'].includes(tab);
    }
    return false;
  };

  const menuItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings & CRM', icon: Calendar, badge: pendingBookingsCount },
    { id: 'contacts', label: 'Contact Messages', icon: MessageSquare, badge: unreadContactsCount },
    { id: 'therapists', label: 'Therapists & Models', icon: Award },
    { id: 'services', label: 'Therapy Services', icon: Sparkles },
    { id: 'schedule', label: 'Schedule & Calendar', icon: Clock },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'users', label: 'Staff & RBAC', icon: Shield },
    { id: 'applications', label: 'Staff Applications', icon: UserPlus },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: Lock },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 bg-[#121212] border-r border-gray-800 text-gray-300 transition-all duration-300 flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-20 px-5 flex items-center justify-between border-b border-gray-800/80">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#2CB5A0] to-emerald-400 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-[#2CB5A0]/20">
                  A
                </div>
                <div>
                  <h1 className="font-bold text-white text-base tracking-wide leading-tight">AURA LUXE</h1>
                  <p className="text-[10px] text-[#2CB5A0] uppercase font-semibold tracking-wider">CRM Control Hub</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="mx-auto w-10 h-10 rounded-xl bg-[#2CB5A0] flex items-center justify-center font-bold text-black text-xl">
                A
              </div>
            )}
            <button
              onClick={() => (mobileOpen ? onCloseMobile() : setCollapsed(!collapsed))}
              className={`p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer ${
                mobileOpen ? 'flex lg:hidden' : 'hidden lg:flex'
              }`}
              title={mobileOpen ? 'Close Menu' : collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* User Badge */}
          {currentUser && !isCollapsed && (
            <div className="p-4 mx-3 my-3 rounded-2xl bg-linear-to-r from-gray-900 to-gray-800/90 border border-gray-800 flex items-center gap-3">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2CB5A0]"
              />
              <div className="overflow-hidden">
                <h4 className="font-semibold text-white text-xs truncate">{currentUser.name}</h4>
                <span className="inline-block px-2 py-0.5 mt-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#2CB5A0]/20 text-[#2CB5A0]">
                  {normalizeRole(currentUser.role).replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
            {menuItems.map((item) => {
              if (!isAllowed(item.id)) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (mobileOpen) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2CB5A0] text-black font-bold shadow-lg shadow-[#2CB5A0]/20 scale-[1.02]'
                      : 'text-gray-400 hover:bg-gray-800/80 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                  {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-black text-white' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Footer */}
        <div className="p-3 border-t border-gray-800/80">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0 text-rose-400" />
            {!isCollapsed && <span className="font-semibold">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};