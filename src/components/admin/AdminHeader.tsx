import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  LogOut,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  X,
  Menu
} from 'lucide-react';
import { AdminUser, NotificationItem } from '../../types';

interface AdminHeaderProps {
  currentUser: AdminUser | null;
  notifications?: NotificationItem[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearNotification?: (id: string) => void;
  onQuickAction?: (action: 'add_booking' | 'add_therapist' | 'add_service') => void;
  onChangePasswordClick?: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNavigateTab: (tab: any) => void;
  collapsed?: boolean;
  setCollapsed?: (c: boolean) => void;
  unreadContactsCount?: number;
  pendingBookingsCount?: number;
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentUser,
  notifications = [],
  onMarkNotificationRead = (_id: string) => {},
  onMarkAllRead = () => {},
  onClearNotification = (_id: string) => {},
  onQuickAction = (_action: 'add_booking' | 'add_therapist' | 'add_service') => {},
  onChangePasswordClick = () => {},
  onLogout,
  searchQuery,
  setSearchQuery,
  onNavigateTab,
  onToggleMobileMenu = () => {},
}) => {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  return (
    <header className="h-20 bg-white border-b border-gray-200/80 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
      {/* Left: mobile menu toggle + Search Input */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer lg:hidden shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 max-w-md min-w-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings, clients, therapists, contacts..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border border-transparent focus:border-[#2CB5A0] focus:bg-white rounded-xl text-xs font-medium text-gray-800 outline-none transition-all min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-black/10 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#2CB5A0]" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {showQuickActions && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
              onClick={() => setShowQuickActions(false)}
            >
              <button
                onClick={() => onQuickAction('add_booking')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-teal-50 text-xs font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#2CB5A0]" /> Create New Booking
              </button>
              <button
                onClick={() => onQuickAction('add_therapist')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-teal-50 text-xs font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-500" /> Add Therapist
              </button>
              <button
                onClick={() => onQuickAction('add_service')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-teal-50 text-xs font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-500" /> Add Therapy Service
              </button>
            </div>
          )}
        </div>

        {/* Notifications Center Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-3 w-[calc(100vw-2.5rem)] max-w-sm sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#2CB5A0]" />
                  <h4 className="font-bold text-xs">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#2CB5A0] text-black font-extrabold text-[10px]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-[11px] text-[#2CB5A0] hover:underline cursor-pointer font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                {safeNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">No notifications right now.</div>
                ) : (
                  safeNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 flex items-start gap-3 transition-colors ${
                        !n.read ? 'bg-teal-50/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'booking' && <CheckCircle2 className="w-4 h-4 text-[#2CB5A0]" />}
                        {n.type === 'contact' && <Bell className="w-4 h-4 text-blue-500" />}
                        {n.type === 'security' && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                        {n.type !== 'booking' && n.type !== 'contact' && n.type !== 'security' && (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-gray-900">{n.title}</h5>
                          <span className="text-[10px] text-gray-400">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                        {n.linkTab && (
                          <button
                            onClick={() => {
                              onNavigateTab(n.linkTab);
                              onMarkNotificationRead(n.id);
                              setShowNotificationsDropdown(false);
                            }}
                            className="mt-1 text-[11px] font-bold text-[#2CB5A0] hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            View in {n.linkTab} <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => onClearNotification(n.id)}
                        className="text-gray-300 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
              }
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#2CB5A0]"
            />
            <div className="text-left hidden md:block pr-1">
              <p className="font-bold text-xs text-gray-900 leading-tight">{currentUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-gray-500 capitalize">{currentUser?.role || 'super_admin'}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
              <div className="p-3 border-b border-gray-100 mb-1">
                <p className="font-bold text-xs text-gray-900">{currentUser?.name}</p>
                <p className="text-[11px] text-gray-500">{currentUser?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onChangePasswordClick();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-xs font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4 text-gray-500" /> Change Password
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-xs font-semibold text-rose-600 flex items-center gap-2 cursor-pointer mt-1"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
