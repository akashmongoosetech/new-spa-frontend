import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Calendar, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { clampSeoDescription, clampSeoTitle } from '../../utils/seo';
import { EntityImage } from '../../components/ui/EntityImage';
import { api, createBooking } from '../../services/api';
import { showToast } from '../../utils/toastEvents';
import { markConversionPending } from '../../utils/analytics';
import { localDateInputValue, formatSlot12h } from '../../utils/date';
import { mockSettings as defaultSettings } from '../../data/mockData';
import NotFound from '../NotFound';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const context = useOutletContext<{
    services?: any[];
    settings?: typeof defaultSettings;
    therapists?: any[];
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const services = context.services ?? [];
  const therapists = context.therapists || [];
  const settings = context.settings || defaultSettings;

  const service = services.find(
    (s) => s.slug === slug || s.id === slug
  );

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
    selectedDate: localDateInputValue(),
    selectedTime: '',
    selectedTherapist: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting'>('idle');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');

  // Live availability so this page only offers slots the API will accept.
  useEffect(() => {
    let cancelled = false;
    if (!bookingData.selectedDate) return;
    setSlotsLoading(true);
    api.getAvailability(bookingData.selectedDate, bookingData.selectedTherapist || 'any')
      .then((res) => {
        if (cancelled) return;
        const slots = (res.slots || []).map((s) => s.time);
        setAvailableSlots(slots);
        setBookingData((prev) =>
          prev.selectedTime && slots.includes(prev.selectedTime)
            ? prev
            : { ...prev, selectedTime: slots[0] || '' }
        );
      })
      .catch(() => {
        if (!cancelled) setAvailableSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => { cancelled = true; };
  }, [bookingData.selectedDate, bookingData.selectedTherapist]);


  const handleBook = async () => {
    if (!service) return;
    setBookingStatus('submitting');
    try {
      if (website) throw new Error('Unable to submit this request');
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.customerEmail.trim());
      if (!bookingData.customerName.trim() || !emailOk || bookingData.customerPhone.replace(/\D/g, '').length < 7) {
        throw new Error('Enter a valid name, email and phone number');
      }
      if (!bookingData.selectedDate || bookingData.selectedDate < localDateInputValue()) {
        throw new Error('Choose a valid future date');
      }
      if (!bookingData.selectedTime) {
        throw new Error('Choose an available time slot');
      }
      if (!consent) {
        throw new Error('Agree to the Privacy Policy before sending this request');
      }
      const result = await createBooking({
        serviceId: service.id,
        therapistId: bookingData.selectedTherapist || 'any',
        date: bookingData.selectedDate,
        timeSlot: bookingData.selectedTime,
        customerName: bookingData.customerName.trim(),
        email: bookingData.customerEmail.trim(),
        phone: bookingData.customerPhone.trim(),
        notes: '',
        paymentMethod: 'pay_at_venue',
        consent: true,
        website
      });
      const reference = result.bookingNumber || result.id || '';
      if (reference) sessionStorage.setItem('tripod_booking_reference', String(reference));
      setBookingStatus('idle');
      markConversionPending('booking');
      navigate('/thank-you?type=booking', { replace: true });
    } catch (err: any) {
      setBookingStatus('idle');
      showToast({
        type: 'error',
        title: 'Booking Failed',
        message: err?.response?.data?.message || err?.message || 'Please try again or contact support.',
      });
    }
  };

  if (!service) {
    return <NotFound />;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans min-h-screen">
      <SEO
        title={clampSeoTitle(`${service.title} | ${settings.businessName}`)}
        description={clampSeoDescription(
          service.shortDescription || service.fullDescription || '',
          `View session details, duration and pricing for ${service.title}, then book a private men-to-men appointment with ${settings.businessName} in Indore.`
        )}
      />

      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--brand-ink)] mb-8 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Therapies
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
            <EntityImage
              src={service.imageUrl}
              alt={`${service.title} at Tripod Wellness`}
              className="w-full h-full object-cover"
              placeholderClassName="w-full h-full"
              label={service.title}
              loading="eager"
            />
            <div className="on-dark-brand absolute top-4 left-4 bg-[#1A1A1A]/90 backdrop-blur-md text-[var(--brand-ink)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#BFA476]/30 flex items-center gap-1.5">
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
              <h2 className="text-xl font-serif font-bold text-gray-900">Session Details</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.benefits.map((b: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-ink)] shrink-0 mt-0.5" />
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
                {service.faq.map((item: { question: string; answer?: string }, idx: number) => (
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl lg:sticky lg:top-28 space-y-6">
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
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--brand-ink)]" />
                <span>Session Duration: <strong className="text-gray-900">{service.durationMinutes} Minutes</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--brand-ink)]" />
                <span>Therapist selection available</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Request Appointment</h3>
              <form onSubmit={e => { e.preventDefault(); handleBook(); }} className="space-y-4" noValidate>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="service-booking-website">Website</label>
                  <input
                    id="service-booking-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    autoComplete="name"
                    value={bookingData.customerName}
                    onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#BFA476] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={bookingData.customerEmail}
                    onChange={(e) => setBookingData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#BFA476] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    maxLength={30}
                    autoComplete="tel"
                    value={bookingData.customerPhone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+91 91716 06807"
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#BFA476] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    required
                    min={localDateInputValue()}
                    value={bookingData.selectedDate}
                    onChange={(e) => setBookingData(prev => ({ ...prev, selectedDate: e.target.value, selectedTime: '' }))}
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#BFA476] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Select Time Slot</label>
                  <select
                    required
                    value={bookingData.selectedTime}
                    onChange={(e) => setBookingData(prev => ({ ...prev, selectedTime: e.target.value }))}
                    disabled={slotsLoading || availableSlots.length === 0}
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#BFA476] focus:outline-none disabled:bg-gray-100"
                  >
                    {slotsLoading && <option value="">Loading available slots…</option>}
                    {!slotsLoading && availableSlots.length === 0 && (
                      <option value="">No slots available — choose another date</option>
                    )}
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{formatSlot12h(slot)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Select Therapist</label>
                  <select
                    value={bookingData.selectedTherapist}
                    onChange={(e) => setBookingData(prev => ({ ...prev, selectedTherapist: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#BFA476] focus:outline-none"
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

                <label htmlFor="service-booking-consent" className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-600">
                  <input
                    id="service-booking-consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#BFA476]"
                  />
                  <span>
                    I agree to the{' '}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--brand-ink)] underline underline-offset-2"
                    >
                      Privacy Policy
                    </a>{' '}
                    and to being contacted about this appointment request.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={bookingStatus === 'submitting' || !consent}
                  className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-brand-950 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#BFA476]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-4 h-4" />
                  {bookingStatus === 'submitting' ? 'Sending request...' : 'Send Booking Request'}
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
