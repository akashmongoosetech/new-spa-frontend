import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Printer,
  X,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Sparkles,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { Booking, Therapist, Service } from '../../types';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  therapists?: Therapist[];
  services?: Service[];
  onBookingUpdated?: (updatedBooking: Booking) => void;
  onBookingCancelled?: (bookingId: string) => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
  therapists = [],
  services = [],
  onBookingUpdated,
  onBookingCancelled,
}) => {
  // View States: 'details' | 'cancel_confirm' | 'reschedule'
  const [viewState, setViewState] = useState<'details' | 'cancel_confirm' | 'reschedule'>('details');

  // Cancel form
  const [cancelReason, setCancelReason] = useState('Schedule conflict');
  const [cancelNotes, setCancelNotes] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Reschedule form
  const [newDate, setNewDate] = useState(booking?.date || new Date().toISOString().split('T')[0]);
  const [newTimeSlot, setNewTimeSlot] = useState(booking?.timeSlot || '02:00 PM');
  const [newTherapistId, setNewTherapistId] = useState(booking?.therapistId || 'any');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // General feedback
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const matchedTherapist = therapists.find((t) => t.id === (newTherapistId !== 'any' ? newTherapistId : booking?.therapistId));
  const therapistDisplayName = matchedTherapist ? matchedTherapist.name : booking?.therapistName || 'Assigned Certified Therapist';

  const timeSlotOptions = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM',
    '07:30 PM',
    '09:00 PM',
  ];

  const handleCopyBookingNumber = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.bookingNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Cancel Handler
  const handleConfirmCancel = async () => {
    if (!booking) return;
    setCancelLoading(true);
    setFeedbackMessage(null);
    try {
      const updated = await api.updateBooking(booking.id, {
        status: 'cancelled',
        bookingNumber: booking.bookingNumber,
        notes: `${booking.additionalNotes || ''} [Cancelled by Client: ${cancelReason}. ${cancelNotes}]`.trim(),
      });

      setFeedbackMessage({
        type: 'success',
        text: 'Your booking has been successfully cancelled. A confirmation email was dispatched.',
      });

      if (onBookingUpdated) onBookingUpdated(updated);
      if (onBookingCancelled) onBookingCancelled(booking.id);

      setViewState('details');
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to cancel reservation. Please try again or contact support.',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // Reschedule Handler
  const handleConfirmReschedule = async () => {
    if (!booking) return;
    if (!newDate || !newTimeSlot) {
      setFeedbackMessage({ type: 'error', text: 'Please select both a date and time slot.' });
      return;
    }

    setRescheduleLoading(true);
    setFeedbackMessage(null);

    try {
      const updated = await api.updateBooking(booking.id, {
        date: newDate,
        timeSlot: newTimeSlot,
        therapistId: newTherapistId,
        therapistName: therapistDisplayName,
        status: 'confirmed',
        bookingNumber: booking.bookingNumber,
      });

      setFeedbackMessage({
        type: 'success',
        text: `Appointment successfully rescheduled to ${newDate} at ${newTimeSlot}!`,
      });

      if (onBookingUpdated) onBookingUpdated(updated);

      setViewState('details');
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to reschedule appointment. Slot may be unavailable.',
      });
    } finally {
      setRescheduleLoading(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Session Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Appointment Confirmation & Details" maxWidth="2xl">
      <div className="font-sans text-gray-800 space-y-6">
        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-gray-400 hover:text-gray-700 text-xs ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* VIEW 1: DETAILS */}
        {viewState === 'details' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-linear-to-r from-[#1A1A1A] to-[#2B2B2B] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-gray-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                    Aura Luxe Reservation
                  </span>
                  <button
                    onClick={handleCopyBookingNumber}
                    className="flex items-center gap-1 text-[11px] font-mono text-gray-300 hover:text-white bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700 cursor-pointer"
                    title="Copy Booking Ref"
                  >
                    <span>#{booking.bookingNumber}</span>
                    {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <h3 className="text-xl font-serif font-bold text-white">{booking.serviceTitle}</h3>
              </div>
              <div className="shrink-0">{getStatusBadge(booking.status)}</div>
            </div>

            {/* Core Appointment Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Therapist & Service */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2CB5A0]">
                  <User className="w-4 h-4" />
                  <span>Therapist & Service</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Certified Therapist:</span>
                    <strong className="text-sm font-semibold text-gray-900">{therapistDisplayName}</strong>
                  </div>
                  <div className="pt-1">
                    <span className="text-gray-400 block text-[11px]">Therapy Session:</span>
                    <strong className="text-gray-800">{booking.serviceTitle}</strong>
                  </div>
                </div>
              </div>

              {/* Date, Time & Location */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C7A36A]">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule & Location</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Date & Time Slot:</span>
                    <strong className="text-sm font-semibold text-gray-900">
                      {booking.date} at {booking.timeSlot}
                    </strong>
                  </div>
                  <div className="pt-1 flex items-center gap-1.5 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-[#2CB5A0] shrink-0" />
                    <span className="text-[11px]">Indore, Ujjain, Dewas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info & Payment Row */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-medium block text-[11px]">Guest Name:</span>
                <strong className="text-gray-900 font-semibold text-sm">
                  {booking.firstName} {booking.lastName}
                </strong>
                <span className="text-gray-500 block text-[11px]">{booking.email}</span>
                <span className="text-gray-500 block text-[11px]">{booking.phone}</span>
              </div>

              <div>
                <span className="text-gray-400 font-medium block text-[11px]">Total Rate:</span>
                <strong className="text-[#2CB5A0] font-bold text-base font-mono">
                  ₹{booking.totalPaid || 1999}
                </strong>
                <span className="text-gray-500 block text-[11px] capitalize">
                  Payment: {booking.paymentMethod ? booking.paymentMethod.replace(/_/g, ' ') : 'Pay at Venue'}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {booking.paymentStatus === 'completed' ? 'Paid' : 'Payment at Arrival'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-medium block text-[11px]">Client Instructions / Notes:</span>
                <p className="text-gray-700 italic text-[11px] line-clamp-2 mt-0.5">
                  {booking.additionalNotes || 'No special requests provided.'}
                </p>
              </div>
            </div>

            {/* Arrival Notice */}
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-700">
              <ShieldCheck className="w-5 h-5 text-[#2CB5A0] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-slate-900">Pre-Session Protocols</strong>
                <span>Please arrive 10 minutes prior to your session. Complimentary private executive showers, steam room access, and organic refreshments are included with your reservation.</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {booking.status !== 'cancelled' && (
                  <>
                    <button
                      id="reschedule-appt-btn"
                      onClick={() => setViewState('reschedule')}
                      className="px-4 py-2.5 rounded-xl bg-teal-50 text-[#2CB5A0] border border-teal-200 hover:bg-teal-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      id="cancel-appt-btn"
                      onClick={() => setViewState('cancel_confirm')}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>

                    <button
                      id="send-reminder-btn"
                      onClick={async () => {
                        try {
                          await api.sendBookingReminder(booking.id);
                          setFeedbackMessage({
                            type: 'success',
                            text: `Automated 24h reminder email sent to ${booking.email}`,
                          });
                        } catch (err: any) {
                          setFeedbackMessage({
                            type: 'error',
                            text: 'Failed to send reminder email.',
                          });
                        }
                      }}
                      className="px-3 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Send 24h Appointment Reminder Email"
                    >
                      <Mail className="w-4 h-4 text-amber-600" />
                      <span>Send Reminder</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="print-confirmation-btn"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-gray-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CANCEL CONFIRMATION */}
        {viewState === 'cancel_confirm' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4"
          >
            <div className="flex items-center gap-3 text-rose-800">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-rose-900">Cancel Appointment Reservation?</h4>
                <p className="text-xs text-rose-700">
                  Are you sure you want to cancel booking #{booking.bookingNumber} for {booking.serviceTitle}?
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-xl border border-rose-100 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Reason for cancellation:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 bg-white"
                >
                  <option value="Schedule conflict">Schedule conflict</option>
                  <option value="Feeling unwell / illness">Feeling unwell / illness</option>
                  <option value="Travelling out of town">Travelling out of town</option>
                  <option value="Found another preferred date">Found another preferred date</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Additional notes (optional):</label>
                <textarea
                  rows={2}
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  placeholder="Let us know how we can serve you better in the future..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewState('details')}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-white cursor-pointer"
              >
                Keep My Booking
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {cancelLoading ? (
                  <span>Cancelling...</span>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: RESCHEDULE PANEL */}
        {viewState === 'reschedule' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-4"
          >
            <div className="flex items-center gap-3 text-teal-900">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-[#2CB5A0]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1A1A1A]">Reschedule Appointment</h4>
                <p className="text-xs text-gray-600">
                  Select a new date and time slot for booking #{booking.bookingNumber}.
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-white p-4 rounded-xl border border-teal-100 text-xs">
              {/* Date Picker */}
              <div>
                <label className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-[#2CB5A0]" />
                  <span>Select New Appointment Date:</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2CB5A0] font-semibold text-gray-800"
                />
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#2CB5A0]" />
                  <span>Select Preferred Time Slot:</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                  {timeSlotOptions.map((slot) => {
                    const isSelected = newTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewTimeSlot(slot)}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Therapist Choice (Optional) */}
              {therapists.length > 0 && (
                <div>
                  <label className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                    <User className="w-4 h-4 text-[#2CB5A0]" />
                    <span>Therapist Preference:</span>
                  </label>
                  <select
                    value={newTherapistId}
                    onChange={(e) => setNewTherapistId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2CB5A0] bg-white font-medium text-gray-800"
                  >
                    <option value="any">First Available Senior Therapist</option>
                    {therapists.map((th) => (
                      <option key={th.id} value={th.id}>
                        {th.name} — {th.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewState('details')}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-white cursor-pointer"
              >
                Back to Details
              </button>

              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={rescheduleLoading}
                className="px-6 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-[#259b89] text-white text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {rescheduleLoading ? (
                  <span>Rescheduling Slot...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Rescheduled Time</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};
