import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { Service, Therapist, Booking } from '../../types';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { localDateInputValue, formatSlot12h } from '../../utils/date';
import { api } from '../../services/api';
import { broadcastNewBooking } from '../../utils/toastEvents';
import { markConversionPending } from '../../utils/analytics';

interface BookingWizardProps {
  services: Service[];
  therapists: Therapist[];
  initialServiceId?: string;
  isOpen?: boolean;
  onBookingSuccess?: (booking: Booking) => void;
  onClose?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  services,
  therapists,
  initialServiceId,
  onBookingSuccess,
  onClose,
}) => {
  const navigate = useNavigate();
  // Step State: 1 = Service, 2 = Therapist, 3 = Date & Time Slot, 4 = Details
  const [step, setStep] = useState<number>(1);

  // Form Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || services[0]?.id || 'srv-1'
  );
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(localDateInputValue());
  // Kept empty until the guest picks a live 24h slot from the calendar.
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Customer Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');

  // Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const currentTherapist = therapists.find((t) => t.id === selectedTherapistId);

  const subtotal = currentService ? currentService.price : 140;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setValidatingCoupon(true);
    try {
      const res = await api.validateCoupon(couponCode, subtotal);
      if (!res.valid || !res.coupon) {
        setAppliedCoupon(null);
        setCouponError(res.message || 'Invalid promotional code');
        return;
      }
      setAppliedCoupon({ code: res.coupon.code, discount: res.discount });
      setCouponError('');
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.message || 'Invalid promotional code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Submit Booking
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) {
      setErrorMessage('Unable to submit this request.');
      return;
    }
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in your full name, email, and phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 7) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMessage('Please choose an available time slot.');
      return;
    }
    if (!consent) {
      setErrorMessage('Please agree to the Privacy Policy before sending this request.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const bookingData = {
        customerName: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        phone: phone.trim(),
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        serviceId: selectedServiceId,
        serviceTitle: currentService?.title,
        therapistId: selectedTherapistId,
        therapistName: selectedTherapistId === 'any' ? 'Any Available Therapist' : currentTherapist?.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        discountAmount: appliedCoupon ? appliedCoupon.discount : 0,
        totalPaid: totalAmount,
        notes: notes.trim(),
        paymentMethod: 'pay_at_venue',
        consent: true,
        website,
      };

      const result = await api.createBooking(bookingData);
      const reference = result.bookingNumber || result.id || '';
      if (reference) {
        sessionStorage.setItem('tripod_booking_reference', String(reference));
      }
      broadcastNewBooking(result);
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
      markConversionPending('booking');
      navigate('/thank-you?type=booking', { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="on-dark-brand bg-[#181410] text-gray-100 rounded-3xl p-4 sm:p-7 max-w-4xl mx-auto shadow-2xl border border-white/10 font-sans relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#DDC8A5]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Step Indicator */}
      {step < 5 && (
        <div className="relative z-10 mb-6 border-b border-white/10 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--brand-ink)] bg-brand-500/15 px-3 py-1 rounded-full border border-[#BFA476]/30">
                Tripod Wellness â€¢ Online Booking
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {step === 1 && '1. Choose Massage Ritual'}
                {step === 2 && '2. Choose Therapist'}
                {step === 3 && '3. Choose Date & Time Slot'}
                {step === 4 && '4. Your Details'}
              </h2>
            </div>
            {/* {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>
            )} */}
          </div>

          {/* Steps Progress Pills */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { num: 1, label: 'Massage' },
              { num: 2, label: 'Therapist' },
              { num: 3, label: 'Date & Time' },
              { num: 4, label: 'Details' },
            ].map((s) => {
              const active = step === s.num;
              const done = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (done) setStep(s.num);
                  }}
                  disabled={!done && !active}
                  className={`py-2 px-2.5 rounded-xl text-left transition-all flex items-center gap-2 border ${
                    done
                      ? 'bg-brand-500/20 border-[#BFA476]/40 text-[var(--brand-ink)] cursor-pointer'
                      : active
                      ? 'bg-white/10 border-[#BFA476] text-white shadow-lg shadow-[#BFA476]/10'
                      : 'bg-white/5 border-transparent text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                      done
                        ? 'bg-brand-500 text-black'
                        : active
                        ? 'bg-[#DDC8A5] text-black'
                        : 'bg-white/10 text-gray-500'
                    }`}
                  >
                    {done ? 'âœ“' : s.num}
                  </div>
                  <span className="text-xs font-semibold truncate hidden sm:inline">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Selection Bar */}
          {step > 1 && (
            <div className="mt-4 p-3 rounded-xl bg-[#201A15] border border-white/10 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-gray-300 flex-wrap">
                <span className="font-semibold text-white flex items-center gap-1">
                  ðŸ’† {currentService?.title}
                </span>
                <span className="text-gray-500">â€¢</span>
                <span className="text-gray-300 flex items-center gap-1">
                  ðŸ‘¤ {selectedTherapistId === 'any' ? 'Any Available Therapist' : currentTherapist?.name}
                </span>
                {step >= 4 && (
                  <>
                    <span className="text-gray-500">â€¢</span>
                    <span className="text-brand-300 flex items-center gap-1">
                      ðŸ“… {selectedDate} @ {formatSlot12h(selectedTimeSlot)}
                    </span>
                  </>
                )}
              </div>
              <span className="font-serif font-bold text-[var(--brand-ink)] text-sm">
                â‚¹{totalAmount}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm font-medium flex items-center gap-2">
          <span>âš ï¸ {errorMessage}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: SELECT MASSAGE THERAPY */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6 relative z-10"
          >
            <p className="text-gray-400 text-xs -mt-2">
              Select a therapy session. The concierge will confirm availability and appointment
              details before your visit.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-120 overflow-y-auto pr-1 scrollbar-thin">
              {services.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-400 text-sm bg-[#201A14] border border-white/10 rounded-2xl">
                  No therapies are currently available. Please check back soon.
                </div>
              )}
              {services.map((srv) => {
                const isSelected = srv.id === selectedServiceId;
                return (
                  <div
                    key={srv.id}
                    id={`select-service-${srv.id}`}
                    onClick={() => setSelectedServiceId(srv.id)}
                    onKeyDown={(e) => handleCardKeyDown(e, () => setSelectedServiceId(srv.id))}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#BFA476]/60 ${
                      isSelected
                        ? 'border-[#BFA476] bg-[#262019] shadow-lg shadow-[#BFA476]/15 scale-[1.01]'
                        : 'border-white/10 hover:border-white/20 bg-[#201A14] hover:bg-[#241D16]'
                    }`}
                  >
                    <div>
                      <div className="flex gap-3.5 items-start">
                        <img
                          src={srv.imageUrl}
                          alt={srv.title}
                          className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-white/10"
                        />
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-white leading-snug">
                            {srv.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold text-gray-400">
                            <span className="flex items-center gap-1 text-[var(--brand-ink)]">
                              <Clock className="w-3.5 h-3.5" />
                              {srv.durationMinutes} mins
                            </span>
                            <span className="text-[var(--brand-ink)] font-serif font-extrabold text-base">
                              â‚¹{srv.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                        {srv.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end text-xs font-semibold">
                      <span
                        className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          isSelected
                            ? 'bg-brand-500 text-black'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        {isSelected ? 'âœ“ Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                id="wizard-step1-next-btn"
                type="button"
                onClick={() => setStep(2)}
                className="px-7 py-3 rounded-2xl bg-linear-to-r from-[#C3AA7E] to-[#BFA476] hover:brightness-110 text-brand-950 font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Continue to Select Therapist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: CHOOSE MALE THERAPIST */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6 relative z-10"
          >
            <p className="text-gray-400 text-xs -mt-2">
              Choose a therapist or let the concierge assign the first available male therapist.
              Availability is confirmed after the request is submitted.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-120 overflow-y-auto pr-1 scrollbar-thin">
              {/* Option: Any Available Therapist */}
              <div
                id="select-therapist-any"
                onClick={() => setSelectedTherapistId('any')}
                onKeyDown={(e) => handleCardKeyDown(e, () => setSelectedTherapistId('any'))}
                role="button"
                tabIndex={0}
                aria-pressed={selectedTherapistId === 'any'}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[#BFA476]/60 ${
                  selectedTherapistId === 'any'
                    ? 'border-[#BFA476] bg-[#262019] shadow-lg shadow-[#BFA476]/15'
                    : 'border-white/10 bg-[#201A14] hover:border-white/20 hover:bg-[#241D16]'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#C3AA7E] to-[#BFA476] flex items-center justify-center text-brand-950 font-bold text-lg shrink-0 shadow-md">
                  <User className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-base">Any Available Therapist</h3>
                    {selectedTherapistId === 'any' && (
                      <span className="text-[10px] bg-brand-500 text-black px-2 py-0.5 rounded-full font-extrabold">Selected</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Fastest availability. Assigns the top available practitioner for your date and time slot.
                  </p>
                </div>
              </div>

              {/* Specific Male Therapists */}
              {therapists.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-400 text-sm bg-[#201A14] border border-white/10 rounded-2xl">
                  No therapists are currently available. The concierge will assign the first available practitioner.
                </div>
              )}
              {therapists.map((th) => {
                const isSelected = th.id === selectedTherapistId;
                return (
                  <div
                    key={th.id}
                    id={`select-therapist-${th.id}`}
                    onClick={() => setSelectedTherapistId(th.id)}
                    onKeyDown={(e) => handleCardKeyDown(e, () => setSelectedTherapistId(th.id))}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center focus:outline-none focus:ring-2 focus:ring-[#BFA476]/60 ${
                      isSelected
                        ? 'border-[#BFA476] bg-[#262019] shadow-lg shadow-[#BFA476]/15'
                        : 'border-white/10 bg-[#201A14] hover:border-white/20 hover:bg-[#241D16]'
                    }`}
                  >
                    <img
                      src={th.imageUrl}
                      alt={th.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm">{th.name}</h3>
                        {isSelected && (
                          <span className="text-[10px] bg-brand-500 text-black px-2 py-0.5 rounded-full font-extrabold">Selected</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--brand-ink)] font-semibold mt-0.5">{th.title}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {th.specialties?.slice(0, 2).map((spec, i) => (
                          <span key={i} className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                id="wizard-step2-back-btn"
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 font-semibold text-sm hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                id="wizard-step2-next-btn"
                type="button"
                onClick={() => setStep(3)}
                className="px-7 py-3 rounded-2xl bg-linear-to-r from-[#C3AA7E] to-[#BFA476] hover:brightness-110 text-brand-950 font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: DATE & TIME SLOTS */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6 relative z-10"
          >
            <AvailabilityCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedTimeSlot={selectedTimeSlot}
              onSelectTimeSlot={setSelectedTimeSlot}
              selectedTherapistId={selectedTherapistId}
            />

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                id="wizard-step3-back-btn"
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 font-semibold text-sm hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                id="wizard-step3-next-btn"
                type="button"
                onClick={() => setStep(4)}
                disabled={!selectedTimeSlot}
                className="px-7 py-3 rounded-2xl bg-linear-to-r from-[#C3AA7E] to-[#BFA476] hover:brightness-110 text-brand-950 font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40"
              >
                <span>Continue to Personal Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: CUSTOMER DETAILS */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6 relative z-10"
          >
            <form onSubmit={handleSubmitBooking} className="space-y-6" noValidate>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="booking-website">Website</label>
                <input
                  id="booking-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="booking-first-name" className="block text-xs font-bold text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    id="booking-first-name"
                    type="text"
                    required
                    maxLength={80}
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#241D16] border border-white/15 text-white text-sm focus:outline-none focus:border-[#BFA476] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="booking-last-name" className="block text-xs font-bold text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="booking-last-name"
                    type="text"
                    required
                    maxLength={80}
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#241D16] border border-white/15 text-white text-sm focus:outline-none focus:border-[#BFA476] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="booking-email" className="block text-xs font-bold text-gray-300 mb-1">
                    Email Address * (For Confirmation)
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul.sharma@example.in"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#241D16] border border-white/15 text-white text-sm focus:outline-none focus:border-[#BFA476] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="booking-phone" className="block text-xs font-bold text-gray-300 mb-1">
                    Phone Number * (WhatsApp / Call)
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    maxLength={30}
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 91716 06807"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#241D16] border border-white/15 text-white text-sm focus:outline-none focus:border-[#BFA476] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="booking-age" className="block text-xs font-bold text-gray-300 mb-1">
                    Age (optional)
                  </label>
                  <input
                    id="booking-age"
                    type="number"
                    min={18}
                    max={120}
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#241D16] border border-white/15 text-white text-sm focus:outline-none focus:border-[#BFA476] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="booking-gender" className="block text-xs font-bold text-gray-300 mb-1">
                    Gender (optional)
                  </label>
                  <select
                    id="booking-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#241D16] border border-white/15 text-white text-sm focus:outline-none focus:border-[#BFA476]"
                  >
                    <option value="" className="bg-[#241D16]">Select (optional)</option>
                    <option value="Male" className="bg-[#241D16]">Male</option>
                    <option value="Non-Binary" className="bg-[#241D16]">Non-Binary</option>
                    <option value="Prefer Not to Say" className="bg-[#241D16]">Prefer Not to Say</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Additional Requests / Focus Areas (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={1000}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Focus on shoulder tension, preferred pressure, or accessibility needs..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#241D16] border border-white/15 text-white text-sm focus:outline-none focus:border-[#BFA476] placeholder-gray-500"
                />
              </div>

              {/* Coupon Code Section */}
              <div className="bg-[#201A14] rounded-2xl p-4 border border-white/10">
                <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[var(--brand-ink)]" />
                  <span>Have a Promotional Code?</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 rounded-xl bg-[#241D16] border border-white/15 text-white text-sm uppercase font-mono focus:outline-none focus:border-[#BFA476]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon}
                    className="px-5 py-2 rounded-xl bg-brand-500 text-black font-bold text-xs hover:bg-brand-400 transition-colors cursor-pointer"
                  >
                    {validatingCoupon ? 'Checking...' : 'Apply Code'}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1">
                    âœ“ Code "{appliedCoupon.code}" applied! Discount: â‚¹{appliedCoupon.discount}
                  </p>
                )}
                {couponError && <p className="text-xs text-rose-400 font-medium mt-2">âœ• {couponError}</p>}
              </div>

              {/* Payment Terms */}
              <div className="rounded-2xl border border-[#BFA476]/30 bg-[#211B16] p-4 text-xs text-gray-300">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-ink)]" />
                  <div className="space-y-1">
                    <p className="font-bold text-white">Payment at venue</p>
                    <p className="leading-relaxed">
                      The website does not collect card, UPI or wallet payments. Payment is made at
                      the venue unless the concierge confirms another method in writing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="space-y-2 rounded-2xl border border-[#BFA476]/30 bg-[#211B16] p-4 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Therapy Session ({currentService?.title}):</span>
                  <span className="font-mono">â‚¹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between font-medium text-emerald-400">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span className="font-mono">-â‚¹{appliedCoupon.discount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                  <span>Estimated total (pay at venue):</span>
                  <span className="font-serif text-base font-extrabold text-[var(--brand-ink)]">â‚¹{totalAmount}</span>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-white/10 bg-[#201A14] p-4 text-xs text-gray-300">
                <label htmlFor="booking-consent" className="flex items-start gap-2.5">
                  <input
                    id="booking-consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#BFA476]"
                  />
                  <span className="leading-relaxed">
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
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 font-semibold text-sm hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#C3AA7E] to-[#BFA476] text-brand-950 font-bold text-sm shadow-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Sending request...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-brand-200" />
                      <span>Send Booking Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingWizard;
