import React from 'react';
import { Service, Therapist, BusinessSettings } from '../types';
import { BookingWizard } from '../components/booking/BookingWizard';

interface BookingPageProps {
  services: Service[];
  therapists: Therapist[];
  settings: BusinessSettings;
  initialServiceId?: string;
  onBookingSuccess?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  services,
  therapists,
  settings,
  initialServiceId,
  onBookingSuccess,
}) => {
  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)] bg-brand-50 px-3 py-1 rounded-full">
            Appointment Request
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Request a Therapy Appointment
          </h1>
          <p className="text-xs text-gray-600 max-w-xl mx-auto">
            Choose a therapy, therapist and preferred time. The concierge will confirm availability by
            email before your visit.
          </p>
        </div>

        <BookingWizard
          services={services}
          therapists={therapists}
          initialServiceId={initialServiceId}
          onBookingSuccess={onBookingSuccess}
        />
      </div>
    </div>
  );
};
