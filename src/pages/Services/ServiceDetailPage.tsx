import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Clock, Star, CheckCircle2, Calendar, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { createBooking } from '../../services/api';
import { mockServices, mockSettings as defaultSettings } from '../../data/mockData';
import NotFound from '../NotFound';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const context = useOutletContext<{
    services?: typeof mockServices;
    settings?: typeof defaultSettings;
    therapists?: any[];
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const services = context.services || mockServices;
  const therapists = context.therapists || [];
  const settings = context.settings || defaultSettings;

  const service = services.find(
    (s) => s.slug === slug || s.id === slug
  );

  if (!service) {
    return <NotFound />;
  }

  const [bookingData, setBookingData] = useState<{
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    selectedDate: string;
    selectedTime: string;
    selectedTherapist: string;
  }>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTime: '10:00 AM',
    selectedTherapist: ''
  });



  const handleBook = async () => {
    try {
      const result = await createBooking({
        serviceId: service.id,
        serviceTitle: service.title,
        therapistId: bookingData.selectedTherapist || 'any',
        therapistName: bookingData.selectedTherapist || 'Any Available Therapist',
        date: bookingData.selectedDate,
        timeSlot: bookingData.selectedTime,
        customerName: bookingData.customerName,
        email: bookingData.customerEmail,
        phone: bookingData.customerPhone,
        notes: '',
        totalPaid: service.price,
        paymentMethod: 'pay_at_venue'
      });
      // On success, navigate away or show success message
      alert('Booking confirmed! Booking number: ' + result.bookingNumber);
    } catch (err) {
      alert('Failed to create booking: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans min-h-screen">
      <SEO
        title={`${service.title} | ${settings.businessName}`}
        description={service.shortDescription}
      />

      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2CB5A0] mb-8 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Therapies
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#1A1A1A]/90 backdrop-blur-md text-[#C7A36A] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#C7A36A]/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {service.category.replace('_', ' ')}
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
              {service.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              {service.fullDescription}
            </p>
          </div>

          {service.benefits && service.benefits.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-gray-900">Key Therapeutic Benefits</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[#2CB5A0] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.faq && service.faq.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-gray-900">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {service.faq.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.question}</h3>
                    <p className="text-gray-600 text-sm font-light leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl sticky top-28 space-y-6">
            <div className="flex items-baseline justify-between border-b pb-4">
              <div>
                <span className="text-3xl font-extrabold text-[#1A1A1A]">
                  {settings.currencySymbol}{service.price}
                </span>
                {service.originalPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2">
                    {settings.currencySymbol}{service.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{service.rating} ({service.reviewsCount})</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#2CB5A0]" />
                <span>Session Duration: <strong className="text-gray-900">{service.durationMinutes} Minutes</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2CB5A0]" />
                <span>Private Male Therapist Assigned</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Book Appointment</h3>
              <form onSubmit={e => { e.preventDefault(); handleBook(); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={bookingData.customerName}
                    onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={bookingData.customerEmail}
                    onChange={(e) => setBookingData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={bookingData.customerPhone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+91 98200 12345"
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookingData.selectedDate}
                    onChange={(e) => setBookingData(prev => ({ ...prev, selectedDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Select Time Slot</label>
                  <select
                    value={bookingData.selectedTime}
                    onChange={(e) => setBookingData(prev => ({ ...prev, selectedTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Select Therapist</label>
                  <select
                    value={bookingData.selectedTherapist}
                    onChange={(e) => setBookingData(prev => ({ ...prev, selectedTherapist: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                  >
                    <option value="">Select a therapist</option>
                    {therapists.length > 0 ? (
                      therapists.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.name} - {t.title}
                        </option>
                      ))
                    ) : (
                      <option value="any">Any Available Therapist</option>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#2CB5A0]/20 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
