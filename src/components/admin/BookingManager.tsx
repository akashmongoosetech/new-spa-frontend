import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Mail,
  Edit2,
  Trash2,
  Download,
  Plus,
  ChevronDown,
  User,
  DollarSign,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Booking, Service, Therapist } from '../../types';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';
import { BookingConfirmationModal } from '../booking/BookingConfirmationModal';

interface BookingManagerProps {
  bookings: Booking[];
  services: Service[];
  therapists: Therapist[];
  onRefreshBookings: () => void;
  onPrintBooking: (booking: Booking) => void;
  onOpenCreateBooking: () => void;
  searchQuery: string;
}

export const BookingManager: React.FC<BookingManagerProps> = ({
  bookings,
  services,
  therapists,
  onRefreshBookings,
  onPrintBooking,
  onOpenCreateBooking,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTherapistFilter, setSelectedTherapistFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Selected Booking for View/Edit Modal
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Edit Form Fields
  const [editStatus, setEditStatus] = useState<Booking['status']>('confirmed');
  const [editTherapistId, setEditTherapistId] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editTimeSlot, setEditTimeSlot] = useState<string>('');
  const [editPaymentStatus, setEditPaymentStatus] = useState<'pending' | 'completed' | 'refunded'>('completed');

  // Filter Logic
  const safeBookings = bookings || [];
  const filteredBookings = safeBookings.filter((b) => {
    if (!b) return false;
    const matchesSearch =
      (b.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.bookingNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.serviceTitle || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesTherapist = selectedTherapistFilter === 'all' || b.therapistId === selectedTherapistFilter;
    const matchesDate = !dateFilter || b.date === dateFilter;

    return matchesSearch && matchesStatus && matchesTherapist && matchesDate;
  });

  const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      onRefreshBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (b: Booking) => {
    setActiveBooking(b);
    setEditStatus(b.status);
    setEditTherapistId(b.therapistId);
    setEditDate(b.date);
    setEditTimeSlot(b.timeSlot);
    setEditPaymentStatus(b.paymentStatus);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!activeBooking) return;
    try {
      const selectedT = therapists.find((t) => t.id === editTherapistId);
      await api.updateBooking(activeBooking.id, {
        status: editStatus,
        therapistId: editTherapistId,
        therapistName: selectedT?.name || activeBooking.therapistName,
        date: editDate,
        timeSlot: editTimeSlot,
        paymentStatus: editPaymentStatus,
      });
      setShowEditModal(false);
      onRefreshBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!activeBooking) return;
    try {
      await api.deleteBooking(activeBooking.id);
      setShowDeleteModal(false);
      onRefreshBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'completed':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Booking Management & CRM</h2>
          <p className="text-xs text-gray-500">Track client appointments, therapist assignments, and payment statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              try {
                await api.downloadExportReport('bookings');
              } catch (err: any) {
                showToast({ type: 'error', title: 'Export Failed', message: err?.message || 'Failed to export CSV.' });
              }
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-gray-500" /> Export CSV
          </button>
          <button
            onClick={onOpenCreateBooking}
            className="px-4 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#2CB5A0]/20"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Therapist Select */}
          <select
            value={selectedTherapistFilter}
            onChange={(e) => setSelectedTherapistFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 outline-none"
          >
            <option value="all">All Therapists</option>
            {therapists.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Date Select */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="text-xs text-[#2CB5A0] font-bold hover:underline cursor-pointer">
              Clear Date
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            id="trigger-all-reminders-btn"
            onClick={async () => {
              try {
                const res = await api.triggerAllReminders();
                showToast({
                  type: 'success',
                  title: 'Reminders Dispatched',
                  message: `Dispatched ${res.count} appointment reminder emails.`,
                });
                onRefreshBookings();
              } catch (err: any) {
                showToast({ type: 'error', title: 'Reminder Job Failed', message: 'Failed to dispatch reminders.' });
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Dispatch 24h appointment reminder emails for all upcoming reservations"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Trigger 24h Reminders ({bookings.filter(b => b.status === 'confirmed').length})</span>
          </button>

          <div className="text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{filteredBookings.length}</span> of {bookings.length} Bookings
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">Booking Code</th>
                <th className="py-4 px-6">Client Info</th>
                <th className="py-4 px-6">Service</th>
                <th className="py-4 px-6">Therapist</th>
                <th className="py-4 px-6">Date & Slot</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No bookings found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-gray-900">
                      {b.bookingNumber}
                      <p className="text-[10px] font-sans text-gray-400 font-normal">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900">
                        {b.firstName} {b.lastName}
                      </p>
                      <p className="text-[11px] text-gray-500">{b.email}</p>
                      <p className="text-[10px] text-gray-400">{b.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-[#2CB5A0]">{b.serviceTitle}</p>
                      <p className="text-[10px] text-gray-400">{b.durationMinutes} Mins</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-800">{b.therapistName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900">{b.date}</p>
                      <p className="text-[10px] text-gray-500">{b.timeSlot}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-black text-gray-900">₹{b.totalPaid}</p>
                      <span className="text-[9px] uppercase font-bold text-gray-400">{b.paymentStatus}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1">
                      <button
                        onClick={() => {
                          setActiveBooking(b);
                          setShowConfirmationModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-teal-50 text-[#2CB5A0] hover:bg-teal-100 cursor-pointer"
                        title="View Confirmation & Reschedule/Cancel Modal"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                          title="Confirm Booking"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onPrintBooking(b)}
                        className="p-1.5 rounded-lg bg-[#1A1A1A] text-white hover:bg-gray-800 cursor-pointer"
                        title="Print Voucher Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                        title="Edit Booking"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveBooking(b);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Booking Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Booking #${activeBooking?.bookingNumber}`}>
        {activeBooking && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Appointment Status</label>
              <select
                value={editStatus}
                onChange={(e: any) => setEditStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-[#2CB5A0] outline-none"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Therapist</label>
              <select
                value={editTherapistId}
                onChange={(e) => setEditTherapistId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-[#2CB5A0] outline-none"
              >
                {therapists.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.title})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reschedule Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Time Slot</label>
                <input
                  type="text"
                  value={editTimeSlot}
                  onChange={(e) => setEditTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none"
                  placeholder="02:00 PM"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Payment Status</label>
              <select
                value={editPaymentStatus}
                onChange={(e: any) => setEditPaymentStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold outline-none"
              >
                <option value="pending">Pending Pay at Venue</option>
                <option value="completed">Paid / Completed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-[#2CB5A0] text-xs font-bold text-white cursor-pointer shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete Booking">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Are you sure you want to permanently remove booking <span className="font-bold text-gray-900">#{activeBooking?.bookingNumber}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold cursor-pointer">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-5 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white cursor-pointer">
              Permanently Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Booking Confirmation Details Modal */}
      {showConfirmationModal && activeBooking && (
        <BookingConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          booking={activeBooking}
          therapists={therapists}
          services={services}
          onBookingUpdated={() => {
            onRefreshBookings();
          }}
          onBookingCancelled={() => {
            onRefreshBookings();
          }}
        />
      )}
    </div>
  );
};
