import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Phone,
  ShieldCheck,
  Award,
  Star,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { BusinessSettings } from '../../types';

interface HeroProps {
  settings: BusinessSettings;
  onOpenBooking: (serviceId?: string) => void;
  setActiveTab?: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenBooking,
  setActiveTab
}) => {
  const currencySymbol = settings?.currencySymbol || '₹';
  const phoneNumber = settings?.phone || '+91-9171606807';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0F1416] text-white pt-16 pb-24">
      {/* Background Image Layer with Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop"
          alt="Tripod Wellness Luxury Spa Sanctuary"
          className="w-full h-full object-cover object-center filter brightness-75 contrast-110 scale-105 transform transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Layered vignette overlays for optical contrast */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0D1113]/95 via-[#0D1113]/80 to-[#0D1113]/60" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0D1113] via-transparent to-black/40" />
      </div>

      {/* Decorative Golden Glow Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#2CB5A0]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C7A36A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Main Content Column */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          {/* Tagline / Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1C2628]/80 border border-[#2CB5A0]/35 backdrop-blur-md text-[#6FD3C4] text-xs sm:text-sm font-semibold tracking-wide shadow-lg"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#2CB5A0] animate-pulse" />
            <Sparkles className="w-4 h-4 text-[#C7A36A]" />
            <span>Tripod Wellness • Premier Men's Wellness & Spa</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold leading-[1.1] tracking-tight text-white">
              Indulge in <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2CB5A0] via-[#81E3D4] to-[#E3C99B]">
                Tripod Wellness
              </span>{' '}
              Serenity
            </h1>
            <p className="text-[#A3B8B5] text-lg sm:text-xl font-light max-w-2xl leading-relaxed pt-2">
              Indore, Ujjain, Dewas exclusive sanctuary for executive men. Experience restorative Deep Tissue, Swedish Relaxation, Ayurvedic Abhyanga, and Hot Stone Therapy by certified male bodywork masters in private luxury suites.
            </p>
          </motion.div>

          {/* Key Value Bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-sm text-gray-300 font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2CB5A0]" />
              <span>100% Licensed Male Practitioners</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2CB5A0]" />
              <span>Private Hydrotherapy Suites</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2CB5A0]" />
              <span>Indore, Ujjain & Dewas Locations</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <button
              id="hero-book-now-main-btn"
              onClick={() => onOpenBooking()}
              className="group relative w-full sm:w-auto px-9 py-4 rounded-2xl bg-linear-to-r from-[#2CB5A0] via-[#249685] to-[#1A6E61] text-white font-bold text-base shadow-xl hover:shadow-[#2CB5A0]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Calendar className="w-5 h-5 text-teal-100 group-hover:rotate-12 transition-transform" />
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4 text-teal-200 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={`tel:${phoneNumber}`}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl border border-white/15 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2.5 hover:border-[#2CB5A0]/50"
            >
              <Phone className="w-5 h-5 text-[#2CB5A0]" />
              <span>Call Concierge</span>
            </a>

            {setActiveTab && (
              <button
                onClick={() => setActiveTab('services')}
                className="w-full sm:w-auto px-6 py-4 text-sm font-semibold text-[#81E3D4] hover:text-white transition-colors cursor-pointer underline underline-offset-4 decoration-teal-500/40 hover:decoration-teal-400"
              >
                View All Therapies
              </button>
            )}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-medium text-gray-300"
          >
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.98 / 5</span>
              <span className="text-gray-400">(500+ Guest Reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[#81E3D4]">
              <ShieldCheck className="w-4 h-4" />
              <span>Clinical Sanitization</span>
            </div>

            <div className="flex items-center gap-1.5 text-[#E3C99B]">
              <Award className="w-4 h-4" />
              <span>Premium Organic Oils</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Showcase Card Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-white/15 bg-[#121A1C]/85 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-6">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C7A36A]/20 border border-[#C7A36A]/40 text-[#E3C99B] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Signature Choice
              </span>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2CB5A0]" /> Indore • Ujjain • Dewas
              </span>
            </div>

            {/* Featured Therapy Image */}
            <div className="relative h-56 rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop"
                alt="Deep Tissue Muscle Recovery Therapy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-semibold text-teal-200">
                  <Clock className="w-3 h-3 inline mr-1" /> 60 - 90 Minutes
                </span>
                <span className="text-2xl font-serif font-extrabold text-white">
                  {currencySymbol}2,499
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">
                Deep Tissue Muscle Recovery
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2">
                Focused pressure targeting chronic muscular adhesions, postural stiffness, and athletic fatigue with warm therapeutic herbal oils.
              </p>
            </div>

            {/* Quick action card footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="text-xs text-gray-400">
                <span className="block font-semibold text-gray-200">Instant Slots</span>
                <span>Today & Tomorrow</span>
              </div>
              <button
                id="hero-quick-book-btn"
                onClick={() => onOpenBooking('srv-2')}
                className="px-5 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-[#239584] text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
