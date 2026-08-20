import React from 'react';
import { Service, Therapist, BusinessSettings } from '../types';
import { BookingWizard } from '../components/booking/BookingWizard';
import { SEO } from '../components/ui/SEO';

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
      <SEO
        title="Reserve Men-to-Men Massage Appointment | Tripod Wellness"
        description="Book your male therapist online. Live real-time schedule, instant email confirmation, and private suite experience."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Online Reservation
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Book Your Massage Therapy Session
          </h1>
          <p className="text-xs text-gray-600 max-w-xl mx-auto">
            Select your therapy ritual, choose your certified male practitioner, and confirm your slot in under 2 minutes.
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
