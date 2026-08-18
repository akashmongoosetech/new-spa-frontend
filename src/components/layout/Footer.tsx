import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Lock,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Award
} from 'lucide-react';
import { BusinessSettings, Service } from '../../types';

interface FooterProps {
  settings: BusinessSettings;
  services: Service[];
  setActiveTab: (tab: string) => void;
  onSubscribeNewsletter: (email: string) => Promise<void>;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  services,
  setActiveTab,
  onSubscribeNewsletter,
  onOpenBooking
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setSubscribing(true);
    setNewsletterError('');
    try {
      await onSubscribeNewsletter(newsletterEmail);
      setSubscribedSuccess(true);
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterError('Subscription failed. Please try again or contact support.');
    } finally {
      setSubscribing(false);
    }
  };

  const currencySymbol = settings?.currencySymbol || '₹';

  return (
    <footer className="bg-[#0A0E10] text-gray-300 pt-16 pb-12 border-t border-white/10 font-sans relative overflow-hidden">
      {/* Subtle luxury glow accents in background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2CB5A0]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C7A36A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Banner */}
        <div className="bg-gradient-to-r from-[#121A1C] via-[#162124] to-[#0F1618] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl mb-16 relative overflow-hidden backdrop-blur-md">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#2CB5A0]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#2CB5A0] to-[#C7A36A]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#2CB5A0]/15 border border-[#2CB5A0]/30 text-[#81E3D4] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#E3C99B]" /> Exclusive Members Invitation
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Subscribe for Private Aura Luxe Offers & Slots
              </h3>
              <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
                Receive confidential guest invitations to seasonal wellness rituals, prime weekend therapist availability, and holistic health updates.
              </p>
            </div>
            <div className="lg:col-span-5">
              {subscribedSuccess ? (
                <div className="p-4 rounded-2xl bg-[#2CB5A0]/15 border border-[#2CB5A0]/40 text-[#81E3D4] flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2CB5A0]" />
                  <span>Your executive subscription is active! Welcome to Aura Luxe.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email address for the private Aura Luxe newsletter
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your private email..."
                    required
                    aria-invalid={!!newsletterError}
                    className="flex-1 bg-black/50 border border-white/15 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB5A0] focus:ring-1 focus:ring-[#2CB5A0] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#2CB5A0] to-[#208878] hover:brightness-110 text-white font-bold text-sm transition-all shadow-lg hover:shadow-[#2CB5A0]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <span>{subscribing ? 'Joining...' : 'Join Private Club'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
              {newsletterError && (
                <p role="status" className="mt-3 text-xs font-medium text-rose-400">
                  {newsletterError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4 Column Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2CB5A0] to-[#1A6E61] flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg border border-teal-400/30">
                A
              </div>
              <div>
                <span className="block font-serif font-extrabold text-2xl text-white tracking-wider leading-none">
                  AURA LUXE
                </span>
                <span className="block text-[11px] font-semibold tracking-widest text-[#E3C99B] uppercase mt-1">
                  Men's Wellness & Spa Sanctuary
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">
              Indore, Ujjain, Dewas benchmark licensed Men-to-Men massage therapy sanctuary situated in Bandra West. Dedicated to unmatched privacy, medical-grade hygiene, and executive stress recovery.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-[#81E3D4] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#2CB5A0]" />
                <span>100% Certified Professional Male Therapists</span>
              </div>
              <div className="flex items-center gap-2 text-[#E3C99B] font-medium">
                <Award className="w-4 h-4 text-[#C7A36A]" />
                <span>Private Hydrotherapy & Steam Suites</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                Connect With Concierge
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={settings?.instagramUrl || 'https://instagram.com/auraluxespa'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#2CB5A0] hover:bg-[#2CB5A0] text-gray-300 hover:text-white transition-all flex items-center justify-center group"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={settings?.facebookUrl || 'https://facebook.com/auraluxespa'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#2CB5A0] hover:bg-[#2CB5A0] text-gray-300 hover:text-white transition-all flex items-center justify-center group"
                >
                  <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={settings?.twitterUrl || 'https://twitter.com/auraluxespa'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#2CB5A0] hover:bg-[#2CB5A0] text-gray-300 hover:text-white transition-all flex items-center justify-center group"
                >
                  <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500 hover:bg-emerald-600 text-gray-300 hover:text-white transition-all flex items-center justify-center group"
                  >
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-serif font-bold text-base border-b border-white/10 pb-2.5">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#81E3D4] transition-colors flex items-center gap-1">
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-[#81E3D4] transition-colors">
                  Therapies & Menu
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#81E3D4] transition-colors">
                  About Our Sanctuary
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-[#81E3D4] transition-colors">
                  Private Suite Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blog')} className="hover:text-[#81E3D4] transition-colors">
                  Wellness Blog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('faq')} className="hover:text-[#81E3D4] transition-colors">
                  Guest FAQ
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[#81E3D4] transition-colors">
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Therapies */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-serif font-bold text-base border-b border-white/10 pb-2.5">
              Popular Therapies
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {(services || []).slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => {
                      setActiveTab('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#81E3D4] transition-colors text-left flex items-center justify-between w-full group"
                  >
                    <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">{srv.title}</span>
                    <span className="text-[#E3C99B] font-mono shrink-0">{currencySymbol}{srv.price}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2CB5A0]/15 border border-[#2CB5A0]/40 text-[#81E3D4] hover:bg-[#2CB5A0] hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 4: Contact Information */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-serif font-bold text-base border-b border-white/10 pb-2.5">
              Spa Concierge & Location
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2CB5A0] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings?.address || 'Indore, Ujjain, Dewas'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2CB5A0] shrink-0" />
                <a href={`tel:${settings?.phone}`} className="hover:text-white transition-colors">
                  {settings?.phone || '+91 98200 12345'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2CB5A0] shrink-0" />
                <a href={`mailto:${settings?.email}`} className="hover:text-white transition-colors truncate">
                  {settings?.email || 'concierge@auraluxespa.in'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E3C99B] shrink-0" />
                <span>{settings?.workingHours || 'Mon - Sun: 09:00 AM - 10:00 PM IST'}</span>
              </div>
            </div>

            {/* Google Map Link Preview */}
            {settings?.googleMapsUrl && (
              <div className="pt-1">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl overflow-hidden border border-white/10 hover:border-[#2CB5A0] transition-colors bg-[#121A1C] p-3 text-center group"
                >
                  <span className="text-xs font-semibold text-gray-300 group-hover:text-[#81E3D4] transition-colors flex items-center justify-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2CB5A0]" /> Google Maps Directions
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Copyright & Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {settings?.businessName || 'Aura Luxe Spa'}. All Rights Reserved.</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-400">Premier Licensed Men's Spa Sanctuary</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <button onClick={() => setActiveTab('privacy')} className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('terms')} className="hover:text-gray-300 transition-colors">
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-[#E3C99B] transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-[#C7A36A]" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

