import React, { useState } from 'react';
import { Search, Calendar, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Booking, Therapist, Service } from '../../types';
import { api } from '../../services/api';
import { BookingConfirmationModal } from './BookingConfirmationModal';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapists?: Therapist[];
  services?: Service[];
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  onClose,
  therapists = [],
  services = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setFoundBooking(null);

    try {
      const result = await api.lookupBooking(searchQuery);
      if (!result) {
        setErrorMsg('No appointment found matching that Booking Reference or Email address.');
      } else {
        setFoundBooking(result);
        setShowConfirmationModal(true);
      }
    } catch (err: any) {
      setErrorMsg('Error looking up appointment. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen && !showConfirmationModal} onClose={onClose} title="Manage Your Reservation" maxWidth="md">
        <div className="font-sans text-gray-800 space-y-4 py-2">
          <div className="bg-teal-50/70 border border-teal-100 p-4 rounded-2xl text-xs text-gray-700 space-y-1">
            <h4 className="font-bold text-[#1A1A1A] text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#2CB5A0]" />
              Find Your Appointment
            </h4>
            <p className="text-gray-600">
              Enter your <strong>Booking Reference ID</strong> (e.g., <code>AURA-12345</code>) or the <strong>Email address</strong> used when reserving.
            </p>
          </div>

          <form onSubmit={handleLookup} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Booking ID or Email:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. AURA-74921 or client@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#2CB5A0] focus:ring-1 focus:ring-[#2CB5A0]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-[#259b89] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <span>View Reservation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      {showConfirmationModal && foundBooking && (
        <BookingConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => {
            setShowConfirmationModal(false);
            setFoundBooking(null);
            onClose();
          }}
          booking={foundBooking}
          therapists={therapists}
          services={services}
          onBookingUpdated={(updated) => {
            setFoundBooking(updated);
          }}
          onBookingCancelled={() => {
            // Updated status handled in modal
          }}
        />
      )}
    </>
  );
};
