import React from 'react';
import { Printer, Download, Sparkles, CheckCircle2, Calendar, Clock, User, Phone, Mail, MapPin } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Booking } from '../../types';

interface PrintBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const PrintBookingModal: React.FC<PrintBookingModalProps> = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Booking Receipt & Pass #${booking.bookingNumber}`} size="lg">
      <div id="printable-booking-receipt" className="p-6 bg-white border border-gray-100 rounded-3xl space-y-6">
        {/* Receipt Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2CB5A0] flex items-center justify-center font-black text-black text-sm">
                A
              </div>
              <h2 className="font-extrabold text-gray-900 text-lg tracking-wider">AURA LUXE SPA</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Premier Men-to-Men Massage & Wellness Suites</p>
            <p className="text-[11px] text-gray-400">Indore, Ujjain, Dewas • +91 91716 06807</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-[#2CB5A0]">
              {booking.status}
            </span>
            <p className="text-xs font-mono font-bold text-gray-800 mt-1">Ref: {booking.bookingNumber}</p>
            <p className="text-[10px] text-gray-400">Issued: {new Date(booking.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer & Session Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Guest Information</span>
            <p className="font-bold text-gray-900 mt-1">{booking.firstName} {booking.lastName}</p>
            <p className="text-gray-600">{booking.email}</p>
            <p className="text-gray-600">{booking.phone}</p>
            <p className="text-gray-500 mt-0.5">Gender/Age: {booking.gender}, {booking.age} yrs</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Therapy Appointment</span>
            <p className="font-bold text-[#2CB5A0] mt-1">{booking.serviceTitle}</p>
            <p className="text-gray-800 font-semibold mt-0.5">Therapist: {booking.therapistName}</p>
            <p className="text-gray-700">Date: {booking.date}</p>
            <p className="text-gray-700">Time: {booking.timeSlot} ({booking.durationMinutes} Mins)</p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-2 border-t pt-4 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Base Therapy Price:</span>
            <span className="font-semibold">₹{booking.price}</span>
          </div>
          {booking.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount / Promo ({booking.couponCode}):</span>
              <span className="font-semibold">-₹{booking.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-900 font-black text-sm border-t pt-2">
            <span>Total Payable:</span>
            <span className="text-[#2CB5A0]">₹{booking.totalPaid}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>Payment Option:</span>
            <span className="uppercase font-semibold">{booking.paymentMethod.replace(/_/g, ' ')} ({booking.paymentStatus})</span>
          </div>
        </div>

        {/* Rules & Policy */}
        <div className="p-3 bg-amber-50 rounded-xl text-[10px] text-amber-800 leading-relaxed border border-amber-100">
          <p className="font-bold mb-0.5">Spa Protocol & Arrival Rules:</p>
          Please arrive 15 minutes prior to your scheduled therapy time. Complimentary herbal tea and private hydrotherapy shower suites are prepared for your arrival. Rescheduling requires 4 hours advance notice.
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#2CB5A0]/20"
          >
            <Printer className="w-4 h-4" /> Print Voucher
          </button>
        </div>
      </div>
    </Modal>
  );
};
