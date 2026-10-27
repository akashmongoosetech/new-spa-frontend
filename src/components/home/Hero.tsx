import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Phone,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { BusinessSettings, Service } from '../../types';
import { EntityImage } from '../ui/EntityImage';

interface HeroProps {
  settings: BusinessSettings;
  services: Service[];
  onOpenBooking: (serviceId?: string) => void;
  setActiveTab?: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  services,
  onOpenBooking,
  setActiveTab,
}) => {
  const currencySymbol = settings?.currencySymbol || '₹';
  const phoneNumber = settings?.phone || '';
  const featuredService = services.find((service) => service.featured) || services[0];

  return (
    <section className="on-dark-brand relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-[#181410] pb-24 pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,164,118,0.22),transparent_38%),radial-gradient(circle_at_82%_72%,rgba(195,170,126,0.14),transparent_42%),linear-gradient(135deg,#181410_0%,#211B16_52%,#120F0B_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="absolute inset-0 bg-linear-to-t from-[#15110D] via-transparent to-black/30" />
      </div>

      <div className="pointer-events-none absolute left-10 top-1/4 z-0 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 z-0 h-96 w-96 rounded-full bg-[#BFA476]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="space-y-8 text-center lg:col-span-7 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#BFA476]/35 bg-[#211B16]/80 px-4 py-2 text-xs font-semibold tracking-wide text-[var(--brand-ink)] shadow-lg backdrop-blur-md sm:text-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-500" />
            <Sparkles className="h-4 w-4 text-[var(--brand-ink)]" />
            <span>Tripod Wellness • Men-to-Men Massage Therapy</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl font-serif font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Private Men-to-Men
              <br />
              <span className="bg-linear-to-r from-[#BFA476] via-[#DDC8A5] to-[#DDC8A5] bg-clip-text text-transparent">
                Massage Therapy
              </span>
            </h1>
            <p className="mx-auto max-w-2xl pt-2 text-lg font-light leading-relaxed text-[#C3AA7E] sm:text-xl lg:mx-0">
              Massage therapy for men in Indore, Ujjain and Dewas. Choose a therapy,
              select a therapist, and send a private appointment request online.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-300 lg:justify-start"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--brand-ink)]" />
              <span>Male massage therapists</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--brand-ink)]" />
              <span>Appointment requests</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--brand-ink)]" />
              <span>Indore • Ujjain • Dewas</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start"
          >
            <button
              id="hero-book-now-main-btn"
              onClick={() => onOpenBooking(featuredService?.id)}
              className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-linear-to-r from-[#C3AA7E] via-[#BFA476] to-[#BFA476] px-9 py-4 text-base font-bold text-brand-950 shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[#BFA476]/25 active:scale-[0.98] sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <Calendar className="h-5 w-5 text-brand-100 transition-transform group-hover:rotate-12" />
              <span>Request Appointment</span>
              <ArrowRight className="h-4 w-4 text-brand-200 transition-transform group-hover:translate-x-1" />
            </button>

            {phoneNumber && (
              <a
                href={`tel:${phoneNumber}`}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-black/40 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-[#BFA476]/50 hover:bg-black/60 sm:w-auto"
              >
                <Phone className="h-5 w-5 text-[var(--brand-ink)]" />
                <span>Call Concierge</span>
              </a>
            )}

            {setActiveTab && (
              <button
                onClick={() => setActiveTab('services')}
                className="w-full cursor-pointer px-6 py-4 text-sm font-semibold text-[var(--brand-ink)] underline decoration-brand-500/40 underline-offset-4 transition-colors hover:text-white hover:decoration-brand-400 sm:w-auto"
              >
                View All Therapies
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-6 text-xs font-medium text-gray-300 sm:text-sm lg:justify-start"
          >
            <div className="flex items-center gap-1.5 text-[var(--brand-ink)]">
              <Calendar className="h-4 w-4" />
              <span>Online appointment requests</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--brand-ink)]">
              <Mail className="h-4 w-4" />
              <span>Email updates</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--brand-ink)]">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp concierge</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative lg:col-span-5"
        >
          {featuredService ? (
            <div className="relative mx-auto max-w-md space-y-6 overflow-hidden rounded-3xl border border-white/15 bg-[#1B1611]/85 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFA476]/40 bg-[#BFA476]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand-ink)]">
                  <Sparkles className="h-3 w-3" /> Featured Therapy
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                  <MapPin className="h-3.5 w-3.5 text-[var(--brand-ink)]" /> Indore • Ujjain • Dewas
                </span>
              </div>

              <div className="relative h-52 overflow-hidden rounded-2xl">
                <EntityImage
                  src={featuredService.imageUrl}
                  alt={`${featuredService.title} at Tripod Wellness`}
                  className="h-full w-full object-cover"
                  placeholderClassName="h-full w-full"
                  label={featuredService.title}
                  loading="eager"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                  <span className="rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-brand-200 backdrop-blur-md">
                    <Clock className="mr-1 inline h-3 w-3" /> {featuredService.durationMinutes} minutes
                  </span>
                  <span className="font-serif text-2xl font-extrabold text-white">
                    {currencySymbol}{featuredService.price}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-serif font-bold text-white">{featuredService.title}</h2>
                <p className="line-clamp-3 text-xs leading-relaxed text-gray-300 sm:text-sm">
                  {featuredService.shortDescription}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <div className="text-xs text-gray-400">
                  <span className="block font-semibold text-gray-200">Booking request</span>
                  <span>Concierge confirmation</span>
                </div>
                <button
                  id="hero-quick-book-btn"
                  onClick={() => onOpenBooking(featuredService.id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold text-brand-950 shadow-md transition-all hover:scale-105 hover:bg-[#80663F] sm:text-sm"
                >
                  <span>Request</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-3xl border border-white/15 bg-[#1B1611]/85 p-7 text-center shadow-2xl backdrop-blur-xl">
              <Sparkles className="mx-auto h-8 w-8 text-[var(--brand-ink)]" />
              <h2 className="mt-3 font-serif text-xl font-bold text-white">Choose Your Therapy</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                View the current therapy menu, session lengths and prices, then send a private
                appointment request.
              </p>
              {setActiveTab && (
                <button
                  onClick={() => setActiveTab('services')}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950"
                >
                  View Therapies <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
