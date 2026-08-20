import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Printer,
  Star,
  Award,
  ChevronRight,
  X,
  CreditCard,
  Building2,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Service, Therapist, Booking } from '../../types';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { api } from '../../services/api';
import { BookingConfirmationModal } from './BookingConfirmationModal';
import { broadcastNewBooking } from '../../utils/toastEvents';

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
  // Step State: 1 = Service, 2 = Therapist, 3 = Date & Time Slot, 4 = Details & Payment, 5 = Confirmation
  const [step, setStep] = useState<number>(1);

  // Form Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || services[0]?.id || 'srv-1'
  );
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('02:00 PM');

  // Customer Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState('Male');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pay_at_venue' | 'credit_card' | 'upi' | 'paypal'>('pay_at_venue');

  // Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
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
    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage('Please fill in your full name, email, and phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const bookingData = {
        customerName: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        age,
        gender,
        serviceId: selectedServiceId,
        serviceTitle: currentService?.title,
        therapistId: selectedTherapistId,
        therapistName: selectedTherapistId === 'any' ? 'Any Available Therapist' : currentTherapist?.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        discountAmount: appliedCoupon ? appliedCoupon.discount : 0,
        totalPaid: totalAmount,
        notes,
        paymentMethod,
      };

      const result = await api.createBooking(bookingData);
      setCompletedBooking(result);
      setStep(5); // Go to confirmation

      // Broadcast real-time booking event to trigger client toast & admin alerts
      broadcastNewBooking(result);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2CB5A0', '#81E3D4', '#E3C99B'],
        });
      } catch (err) {
        // ignore
      }

      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="bg-[#0F1517] text-gray-100 rounded-3xl p-4 sm:p-7 max-w-4xl mx-auto shadow-2xl border border-white/10 font-sans relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#2CB5A0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#E3C99B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Step Indicator */}
      {step < 5 && (
        <div className="relative z-10 mb-6 border-b border-white/10 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2CB5A0] bg-[#2CB5A0]/15 px-3 py-1 rounded-full border border-[#2CB5A0]/30">
                Tripod Wellness • Online Booking
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {step === 1 && '1. Choose Massage Ritual'}
                {step === 2 && '2. Choose Male Therapist'}
                {step === 3 && '3. Choose Date & Time Slot'}
                {step === 4 && '4. Details & Payment Method'}
              </h2>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
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
                      ? 'bg-[#2CB5A0]/20 border-[#2CB5A0]/40 text-[#81E3D4] cursor-pointer'
                      : active
                      ? 'bg-white/10 border-[#2CB5A0] text-white shadow-lg shadow-[#2CB5A0]/10'
                      : 'bg-white/5 border-transparent text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                      done
                        ? 'bg-[#2CB5A0] text-black'
                        : active
                        ? 'bg-[#E3C99B] text-black'
                        : 'bg-white/10 text-gray-500'
                    }`}
                  >
                    {done ? '✓' : s.num}
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
            <div className="mt-4 p-3 rounded-xl bg-[#162023] border border-white/10 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-gray-300 flex-wrap">
                <span className="font-semibold text-white flex items-center gap-1">
                  💆 {currentService?.title}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300 flex items-center gap-1">
                  👤 {selectedTherapistId === 'any' ? 'Any Available Therapist' : currentTherapist?.name}
                </span>
                {step >= 4 && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-teal-300 flex items-center gap-1">
                      📅 {selectedDate} @ {selectedTimeSlot}
                    </span>
                  </>
                )}
              </div>
              <span className="font-serif font-bold text-[#E3C99B] text-sm">
                ₹{totalAmount}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm font-medium flex items-center gap-2">
          <span>⚠️ {errorMessage}</span>
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
              Select your signature therapy session. All treatments include private suite access and post-session herbal tea.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-120 overflow-y-auto pr-1 scrollbar-thin">
              {services.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-400 text-sm bg-[#141C1E] border border-white/10 rounded-2xl">
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#2CB5A0]/60 ${
                      isSelected
                        ? 'border-[#2CB5A0] bg-[#18282B] shadow-lg shadow-[#2CB5A0]/15 scale-[1.01]'
                        : 'border-white/10 hover:border-white/20 bg-[#141C1E] hover:bg-[#182225]'
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
                            <span className="flex items-center gap-1 text-[#81E3D4]">
                              <Clock className="w-3.5 h-3.5" />
                              {srv.durationMinutes} mins
                            </span>
                            <span className="text-[#E3C99B] font-serif font-extrabold text-base">
                              ₹{srv.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                        {srv.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#E3C99B] flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#E3C99B] text-[#E3C99B]" />
                        {srv.rating} ({srv.reviewsCount} reviews)
                      </span>
                      <span
                        className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          isSelected
                            ? 'bg-[#2CB5A0] text-black'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Select'}
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
                className="px-7 py-3 rounded-2xl bg-linear-to-r from-[#2CB5A0] to-[#1a6e61] hover:brightness-110 text-white font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all"
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
              All therapists are certified male practitioners specialized in deep tissue, sports therapy, and Swedish pressure points.
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
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[#2CB5A0]/60 ${
                  selectedTherapistId === 'any'
                    ? 'border-[#2CB5A0] bg-[#18282B] shadow-lg shadow-[#2CB5A0]/15'
                    : 'border-white/10 bg-[#141C1E] hover:border-white/20 hover:bg-[#182225]'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#2CB5A0] to-[#1A6E61] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                  <User className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-base">Any Available Therapist</h3>
                    {selectedTherapistId === 'any' && (
                      <span className="text-[10px] bg-[#2CB5A0] text-black px-2 py-0.5 rounded-full font-extrabold">Selected</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Fastest availability. Assigns the top available practitioner for your date and time slot.
                  </p>
                </div>
              </div>

              {/* Specific Male Therapists */}
              {therapists.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-400 text-sm bg-[#141C1E] border border-white/10 rounded-2xl">
                  No therapists are currently available. The spa will assign the best available practitioner.
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center focus:outline-none focus:ring-2 focus:ring-[#2CB5A0]/60 ${
                      isSelected
                        ? 'border-[#2CB5A0] bg-[#18282B] shadow-lg shadow-[#2CB5A0]/15'
                        : 'border-white/10 bg-[#141C1E] hover:border-white/20 hover:bg-[#182225]'
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
                          <span className="text-[10px] bg-[#2CB5A0] text-black px-2 py-0.5 rounded-full font-extrabold">Selected</span>
                        )}
                      </div>
                      <p className="text-xs text-[#81E3D4] font-semibold mt-0.5">{th.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1 text-[#E3C99B] font-bold">
                          <Star className="w-3 h-3 fill-[#E3C99B] text-[#E3C99B]" />
                          {th.rating}
                        </span>
                        <span>•</span>
                        <span>{th.experienceYears} yrs exp</span>
                        <span>•</span>
                        <span>{th.reviewCount} sessions</span>
                      </div>
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
                className="px-7 py-3 rounded-2xl bg-linear-to-r from-[#2CB5A0] to-[#1a6e61] hover:brightness-110 text-white font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all"
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
                className="px-7 py-3 rounded-2xl bg-linear-to-r from-[#2CB5A0] to-[#1a6e61] hover:brightness-110 text-white font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40"
              >
                <span>Continue to Personal Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: CUSTOMER DETAILS & PAYMENT METHOD */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6 relative z-10"
          >
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#182225] border border-white/15 text-white text-sm focus:outline-none focus:border-[#2CB5A0] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#182225] border border-white/15 text-white text-sm focus:outline-none focus:border-[#2CB5A0] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Email Address * (For Confirmation)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul.sharma@example.in"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#182225] border border-white/15 text-white text-sm focus:outline-none focus:border-[#2CB5A0] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Phone Number * (WhatsApp / Call)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91-9171606807"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#182225] border border-white/15 text-white text-sm focus:outline-none focus:border-[#2CB5A0] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#182225] border border-white/15 text-white text-sm focus:outline-none focus:border-[#2CB5A0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Gender Identity
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#182225] border border-white/15 text-white text-sm focus:outline-none focus:border-[#2CB5A0]"
                  >
                    <option value="Male" className="bg-[#182225]">Male</option>
                    <option value="Non-Binary" className="bg-[#182225]">Non-Binary</option>
                    <option value="Prefer Not to Say" className="bg-[#182225]">Prefer Not to Say</option>
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Focus on lower back stiffness, preferred pressure intensity, or shoulder tension..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#182225] border border-white/15 text-white text-sm focus:outline-none focus:border-[#2CB5A0] placeholder-gray-500"
                />
              </div>

              {/* Coupon Code Section */}
              <div className="bg-[#141C1E] rounded-2xl p-4 border border-white/10">
                <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#2CB5A0]" />
                  <span>Have a Promotional Code? (Try AURA500)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 rounded-xl bg-[#182225] border border-white/15 text-white text-sm uppercase font-mono focus:outline-none focus:border-[#2CB5A0]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon}
                    className="px-5 py-2 rounded-xl bg-[#2CB5A0] text-black font-bold text-xs hover:bg-[#259b89] transition-colors cursor-pointer"
                  >
                    {validatingCoupon ? 'Checking...' : 'Apply Code'}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1">
                    ✓ Code "{appliedCoupon.code}" applied! Discount: ₹{appliedCoupon.discount}
                  </p>
                )}
                {couponError && <p className="text-xs text-rose-400 font-medium mt-2">✕ {couponError}</p>}
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  Preferred Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'pay_at_venue', label: 'Pay at Venue', icon: Building2 },
                    { id: 'upi', label: 'Instant UPI / QR', icon: Smartphone },
                    { id: 'credit_card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'paypal', label: 'PayPal / Online', icon: Sparkles },
                  ].map((pm) => {
                    const IconComp = pm.icon;
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#2CB5A0] bg-[#2CB5A0]/20 text-white shadow-md'
                            : 'border-white/10 bg-[#141C1E] text-gray-300 hover:bg-[#182225]'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#81E3D4]' : 'text-gray-400'}`} />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-[#162225] border border-[#2CB5A0]/30 space-y-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Therapy Session ({currentService?.title}):</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span className="font-mono">-₹{appliedCoupon.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Payable:</span>
                  <span className="font-serif font-extrabold text-[#E3C99B] text-base">₹{totalAmount}</span>
                </div>
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
                  className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#2CB5A0] to-[#1a6e61] text-white font-bold text-sm shadow-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Reserving Appointment...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-teal-200" />
                      <span>Confirm & Reserve Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 5: CONFIRMATION RECEIPT */}
        {step === 5 && completedBooking && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-4 relative z-10"
          >
            <div className="w-20 h-20 rounded-full bg-[#2CB5A0]/20 border-4 border-[#2CB5A0] text-[#81E3D4] flex items-center justify-center mx-auto shadow-2xl shadow-[#2CB5A0]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 uppercase tracking-widest border border-emerald-500/30 mb-2">
                Reservation Confirmed
              </span>
              <h2 className="text-3xl font-serif font-bold text-white">
                Thank You, {completedBooking.firstName || 'Guest'}!
              </h2>
              <p className="text-gray-300 text-sm mt-1 max-w-md mx-auto">
                Your massage therapy session has been confirmed. Details sent to{' '}
                <strong className="text-white">{completedBooking.email}</strong>.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#141C1E] border border-white/10 rounded-3xl p-6 text-left max-w-xl mx-auto shadow-xl space-y-3 font-sans">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Booking Reference
                  </span>
                  <span className="text-xl font-serif font-bold text-white">
                    {completedBooking.bookingNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    Status: {completedBooking.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs py-2">
                <div>
                  <span className="text-gray-400 font-semibold block">Massage Therapy:</span>
                  <span className="font-bold text-white text-sm">{completedBooking.serviceTitle}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Male Therapist:</span>
                  <span className="font-bold text-white text-sm">{completedBooking.therapistName}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Scheduled Date & Time:</span>
                  <span className="font-bold text-[#81E3D4] text-sm">
                    {completedBooking.date} @ {completedBooking.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Payment Terms:</span>
                  <span className="font-bold text-[#E3C99B] text-sm font-mono">
                    ₹{completedBooking.totalPaid} ({completedBooking.paymentMethod.replace(/_/g, ' ')})
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2CB5A0] shrink-0" />
                <span>Please arrive 10 mins early. Private steam & shower facilities included.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                id="receipt-manage-btn"
                onClick={() => setShowConfirmationModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#2CB5A0]/20 text-[#81E3D4] border border-[#2CB5A0]/40 font-bold text-xs hover:bg-[#2CB5A0]/30 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Reschedule / Cancel Booking</span>
              </button>

              <button
                id="receipt-print-btn"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-gray-300 font-semibold text-xs hover:bg-white/10 flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>

              {onClose && (
                <button
                  id="receipt-done-btn"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-[#259b89] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Close Window
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal with Reschedule / Cancel capabilities */}
      {showConfirmationModal && completedBooking && (
        <BookingConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          booking={completedBooking}
          therapists={therapists}
          services={services}
          onBookingUpdated={(updated) => {
            setCompletedBooking(updated);
          }}
        />
      )}
    </div>
  );
};

export default BookingWizard;
