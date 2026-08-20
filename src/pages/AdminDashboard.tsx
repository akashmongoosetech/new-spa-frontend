import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  DollarSign,
  Plus,
  RefreshCw,
  MessageSquare,
  Award,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Booking, Service, Therapist, BusinessSettings, AdminUser, ContactMessage } from '../types';
import { api } from '../services/api';
import { SEO } from '../components/ui/SEO';
import { AdminTab } from '../components/admin/AdminSidebar';
import { PrintBookingModal } from '../components/admin/PrintBookingModal';
import { BookingManager } from '../components/admin/BookingManager';
import { ContactManager } from '../components/admin/ContactManager';
import { TherapistManager } from '../components/admin/TherapistManager';
import { ServiceManager } from '../components/admin/ServiceManager';
import { ScheduleManager } from '../components/admin/ScheduleManager';
import { UserManagement } from '../components/admin/UserManagement';
import { SettingsModule } from '../components/admin/SettingsModule';
import { ReportsView } from '../components/admin/ReportsView';
import { AuditLogsView } from '../components/admin/AuditLogsView';
import { BookingWizard } from '../components/booking/BookingWizard';
import { showToast, playNotificationSound } from '../utils/toastEvents';

interface AdminDashboardProps {
  settings: BusinessSettings;
  onUpdateSettings: (newSettings: BusinessSettings) => void;
  initialTab?: AdminTab;
  currentUser?: AdminUser | null;
  searchQuery?: string;
}

const TAB_PATH: Record<AdminTab, string> = {
  overview: '/admin/dashboard',
  bookings: '/admin/bookings',
  contacts: '/admin/contacts',
  therapists: '/admin/therapists',
  services: '/admin/services',
  schedule: '/admin/calendar',
  reports: '/admin/reports',
  users: '/admin/users',
  applications: '/admin/applications',
  settings: '/admin/settings',
  audit: '/admin/activity-logs',
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onUpdateSettings,
  initialTab = 'overview',
  currentUser: propCurrentUser,
  searchQuery: propSearchQuery,
}) => {
  const navigate = useNavigate();

  // Current user (provided by AdminLayout via Outlet context, with localStorage fallback).
  const [currentUser] = useState<AdminUser | null>(() => {
    if (propCurrentUser) return propCurrentUser;
    try {
      const saved = localStorage.getItem('aura_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const authToken = localStorage.getItem('aura_admin_token');
  const searchQuery = propSearchQuery || '';

  // Tab State
  const [activeTab, setActiveTabState] = useState<AdminTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTabState(tab);
    navigate(TAB_PATH[tab]);
  };

  // Modals
  const [showCreateBookingWizard, setShowCreateBookingWizard] = useState(false);
  const [printableBooking, setPrintableBooking] = useState<Booking | null>(null);

  // Data Store
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<any>({});

  const knownBookingIdsRef = useRef<Set<string>>(new Set());

  // Function to alert admin of new incoming booking
  const notifyAdminNewBooking = (booking: Booking, isInitialLoad = false) => {
    if (!booking || !booking.id) return;

    const alreadyKnown = knownBookingIdsRef.current.has(booking.id);
    knownBookingIdsRef.current.add(booking.id);

    if (!isInitialLoad && !alreadyKnown) {
      playNotificationSound('admin_alert');
      showToast({
        type: 'admin_alert',
        title: '🔔 New Incoming Appointment!',
        message: `${booking.firstName} ${booking.lastName} booked ${booking.serviceTitle || 'Massage'} with ${booking.therapistName || 'Therapist'} for ${booking.date} @ ${booking.timeSlot}`,
        duration: 8000,
        actionLabel: 'View in Admin',
        onAction: () => {
          handleTabChange('bookings');
        },
        bookingRef: booking.bookingNumber || booking.id,
      });

      setBookings((prev) => {
        const exists = prev.some((b) => b.id === booking.id);
        if (exists) return prev.map((b) => (b.id === booking.id ? booking : b));
        return [booking, ...prev];
      });
    }
  };

  useEffect(() => {
    if (authToken && currentUser) {
      fetchAllAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, currentUser]);

  const fetchAllAdminData = async () => {
    try {
      const [bList, sList, tList, cList, stData] = await Promise.all([
        api.getBookings(),
        api.getServices(),
        api.getTherapists(),
        api.getContactMessages(),
        api.getAdminStats(),
      ]);

      const safeBookings = Array.isArray(bList) ? bList : [];
      safeBookings.forEach((b) => knownBookingIdsRef.current.add(b.id));

      setBookings(safeBookings);
      setServices(Array.isArray(sList) ? sList : []);
      setTherapists(Array.isArray(tList) ? tList : []);
      setContacts(Array.isArray(cList) ? cList : []);
      setStats(stData || {});
    } catch (err) {
      console.error(err);
    }
  };

  // Listen for real-time booking events & background polling for admin
  useEffect(() => {
    if (!authToken || !currentUser) return;

    const handleCustomNewBooking = (e: Event) => {
      const customEv = e as CustomEvent;
      if (customEv.detail && customEv.detail.booking) {
        notifyAdminNewBooking(customEv.detail.booking, false);
      }
    };

    window.addEventListener('aura-new-booking', handleCustomNewBooking);

    // Poll server every 6 seconds for any new incoming bookings (paused if tab is hidden)
    const pollInterval = setInterval(async () => {
      if (document.hidden) return; // Pause network polling when tab is inactive
      try {
        const latestBookings = await api.getBookings();
        if (Array.isArray(latestBookings)) {
          latestBookings.forEach((b) => {
            if (!knownBookingIdsRef.current.has(b.id)) {
              notifyAdminNewBooking(b, false);
            }
          });
        }
      } catch (e) {
        // silent catch during polling
      }
    }, 6000);

    return () => {
      window.removeEventListener('aura-new-booking', handleCustomNewBooking);
      clearInterval(pollInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, currentUser]);

  // Analytics Chart Data — computed from the real bookings list (last 6 months).
  const chartData = useMemo(() => {
    const months: { key: string; month: string; revenue: number; bookings: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleString('en', { month: 'short' }),
        revenue: 0,
        bookings: 0,
      });
    }
    (bookings || []).forEach((b) => {
      if (!b || !b.date) return;
      const d = new Date(b.date);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const m = months.find((x) => x.key === key);
      if (!m) return;
      m.bookings += 1;
      if (b.status !== 'cancelled' && b.status !== 'rejected') {
        m.revenue += b.totalPaid || 0;
      }
    });
    return months;
  }, [bookings]);

  // Revenue trend vs the previous month, derived from real data.
  const revenueMetrics = useMemo(() => {
    const now = new Date();
    const curKey = `${now.getFullYear()}-${now.getMonth()}`;
    const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prevD.getFullYear()}-${prevD.getMonth()}`;
    const cur = chartData.find((c) => c.key === curKey);
    const prev = chartData.find((c) => c.key === prevKey);
    const currentRevenue = cur?.revenue || 0;
    const prevRevenue = prev?.revenue || 0;
    const delta = prevRevenue > 0 ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 1000) / 10 : 100;
    return { currentRevenue, delta };
  }, [chartData]);

  const unreadContactsCount = (contacts || []).filter((c) => c && c.status === 'new').length;
  const pendingBookingsCount = (bookings || []).filter((b) => b && b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <SEO title="CRM Control Hub | Tripod Wellness Admin" />

      {/* Tab Body */}
      <main className="max-w-7xl w-full mx-auto space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="p-8 rounded-3xl bg-linear-to-r from-[#1A1A1A] via-gray-900 to-black text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2CB5A0] text-black">
                  Indore, Ujjain & Dewas Sanctuary
                </span>
                <h1 className="text-2xl font-black tracking-tight">
                  Welcome back, {currentUser?.name || 'Administrator'}!
                </h1>
                <p className="text-xs text-gray-400 max-w-lg">
                  Real-time operational overview for Tripod Wellness Men-to-Men Massage & Executive Wellness Suites.
                </p>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <button
                  onClick={() => setShowCreateBookingWizard(true)}
                  className="px-5 py-3 rounded-2xl bg-[#2CB5A0] hover:bg-teal-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#2CB5A0]/20"
                >
                  <Plus className="w-4 h-4" /> Reserve Walk-In Client
                </button>
                <button
                  onClick={fetchAllAdminData}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Refresh Live Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CRM Key Metrics Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Revenue */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#2CB5A0] flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{settings.currencySymbol || '₹'}{stats?.totalRevenue ?? 0}</h3>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <ArrowUpRight className="w-4 h-4" /> {revenueMetrics.delta >= 0 ? '+' : ''}{revenueMetrics.delta}% <span className="text-gray-400 font-normal">vs last month</span>
                </div>
              </div>

              {/* Total Bookings */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{bookings.length}</h3>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                  <span>{pendingBookingsCount} Pending Approval</span>
                </div>
              </div>

              {/* Contact Inquiries */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Inquiries</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{contacts.length}</h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                  <span>{unreadContactsCount} Unread Messages</span>
                </div>
              </div>

              {/* Active Therapists */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Therapists</span>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{therapists.length}</h3>
                <div className="flex items-center gap-1.5 text-xs text-purple-600 font-bold">
                  <span>100% On-Call Ready</span>
                </div>
              </div>
            </div>

            {/* Revenue & Booking Trends Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Monthly Revenue Analytics</h3>
                    <p className="text-xs text-gray-400">Gross revenue performance from therapy sessions & VIP packages.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#2CB5A0]">
                    2026 Financial Year
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2CB5A0" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2CB5A0" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#2CB5A0" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Bookings Quick Widget */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-extrabold text-gray-900 text-sm">Latest Appointments</h3>
                    <button
                      onClick={() => handleTabChange('bookings')}
                      className="text-xs font-bold text-[#2CB5A0] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3 mt-4">
                    {bookings.slice(0, 4).map((b) => (
                      <div key={b.id} className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-gray-900">{b.firstName} {b.lastName}</p>
                          <p className="text-[10px] text-gray-500">{b.serviceTitle}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#2CB5A0]">{settings.currencySymbol || '₹'}{b.totalPaid}</span>
                          <p className="text-[9px] text-gray-400">{b.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowCreateBookingWizard(true)}
                  className="w-full py-3 rounded-2xl bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4 text-[#2CB5A0]" /> New Reservation
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <BookingManager
            bookings={bookings}
            services={services}
            therapists={therapists}
            onRefreshBookings={fetchAllAdminData}
            onPrintBooking={(b) => setPrintableBooking(b)}
            onOpenCreateBooking={() => setShowCreateBookingWizard(true)}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'contacts' && (
          <ContactManager
            contacts={contacts}
            onRefreshContacts={fetchAllAdminData}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'therapists' && (
          <TherapistManager
            therapists={therapists}
            onRefreshTherapists={fetchAllAdminData}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'services' && (
          <ServiceManager
            services={services}
            onRefreshServices={fetchAllAdminData}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'schedule' && <ScheduleManager />}

        {activeTab === 'users' && (
          <UserManagement currentUser={currentUser} searchQuery={searchQuery} />
        )}

        {activeTab === 'settings' && <SettingsModule />}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'audit' && <AuditLogsView />}
      </main>

      {/* Printable Booking Pass Modal */}
      <PrintBookingModal
        isOpen={!!printableBooking}
        onClose={() => setPrintableBooking(null)}
        booking={printableBooking}
      />

      {/* Booking Wizard Modal */}
      {showCreateBookingWizard && (
        <BookingWizard
          isOpen={showCreateBookingWizard}
          onClose={() => {
            setShowCreateBookingWizard(false);
            fetchAllAdminData();
          }}
          services={services}
          therapists={therapists}
        />
      )}
    </div>
  );
};