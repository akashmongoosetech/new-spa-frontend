import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Calendar
} from 'lucide-react';
import { BusinessSettings, Service } from '../../types';
import { BrandLogo } from '../brand/BrandLogo';
import { analyticsConfigured } from '../../utils/analytics';
import { publicWorkingHours } from '../../utils/settings';

interface FooterProps {
  settings: BusinessSettings;
  services: Service[];
  setActiveTab: (tab: string) => void;
  onSubscribeNewsletter: (email: string, consent: boolean, website?: string) => Promise<void>;
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
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterWebsite, setNewsletterWebsite] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterWebsite) {
      setNewsletterError('Unable to submit this request.');
      return;
    }
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    if (!newsletterConsent) {
      setNewsletterError('Please agree to the Privacy Policy before subscribing.');
      return;
    }
    setSubscribing(true);
    setNewsletterError('');
    try {
      await onSubscribeNewsletter(newsletterEmail.trim(), true, newsletterWebsite);
      setSubscribedSuccess(true);
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterError('Subscription failed. Please try again or contact support.');
    } finally {
      setSubscribing(false);
    }
  };

  const currencySymbol = settings?.currencySymbol || '₹';
  const isUnverifiedSocialUrl = (url?: string) =>
    !url || /auraluxespa|example\.com|twitter\.com\/tripodwellness|instagram\.com\/tripodwellness|facebook\.com\/tripodwellness/i.test(url);
  const socialLinks = [
    { label: 'Instagram', url: settings?.instagramUrl, Icon: Instagram },
    { label: 'Facebook', url: settings?.facebookUrl, Icon: Facebook },
    { label: 'Twitter', url: settings?.twitterUrl, Icon: Twitter },
  ].filter((link) => !isUnverifiedSocialUrl(link.url));

  return (
    <footer className="on-dark-brand bg-[#120F0B] text-gray-300 pt-16 pb-12 border-t border-white/10 font-sans relative overflow-hidden">
      {/* Subtle luxury glow accents in background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#BFA476]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Banner */}
        <div className="bg-linear-to-r from-[#1B1611] via-[#211B16] to-[#181410] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl mb-16 relative overflow-hidden backdrop-blur-md">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-[#BFA476] to-[#BFA476]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-[#BFA476]/30 text-[var(--brand-ink)] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-ink)]" /> Tripod Wellness Updates
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Subscribe for Appointment & Wellness Updates
              </h3>
              <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
                Receive occasional therapy availability, appointment updates and wellness notes.
                You can unsubscribe at any time.
              </p>
            </div>
            <div className="lg:col-span-5">
              {subscribedSuccess ? (
                <div className="p-4 rounded-2xl bg-brand-500/15 border border-[#BFA476]/40 text-[var(--brand-ink)] flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--brand-ink)]" />
                  <span>Your subscription request has been received. You can unsubscribe at any time.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3" noValidate>
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="footer-newsletter-website">Website</label>
                    <input
                      id="footer-newsletter-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={newsletterWebsite}
                      onChange={(e) => setNewsletterWebsite(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address for Tripod Wellness updates
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      maxLength={254}
                      autoComplete="email"
                      aria-invalid={!!newsletterError}
                      className="flex-1 rounded-2xl border border-white/15 bg-black/50 px-4 py-3.5 text-sm text-white placeholder-gray-500 transition-all focus:border-[#BFA476] focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
                    />
                    <button
                      type="submit"
                      disabled={subscribing || !newsletterConsent}
                      className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#C3AA7E] to-[#BFA476] px-6 py-3.5 text-sm font-bold text-brand-950 shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>{subscribing ? 'Subscribing...' : 'Subscribe'}</span>
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <label htmlFor="footer-newsletter-consent" className="flex items-start gap-2 text-[10px] leading-relaxed text-gray-400">
                    <input
                      id="footer-newsletter-consent"
                      type="checkbox"
                      checked={newsletterConsent}
                      onChange={(e) => setNewsletterConsent(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#BFA476]"
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
                      and to receive occasional Tripod Wellness updates. I can unsubscribe at any time.
                    </span>
                  </label>
                </form>
              )}
              {newsletterError && (
                <p role="alert" className="mt-3 text-xs font-medium text-rose-400">
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
              <div className="w-18 h-18 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg border border-brand-400/30 overflow-hidden">
                <BrandLogo
                  variant="icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="block font-serif font-extrabold text-2xl text-white tracking-wider leading-none">
                  TRIPOD WELLNESS
                </span>
                <span className="block text-[11px] font-semibold tracking-widest text-[var(--brand-ink)] uppercase mt-1">
                  RESTORE · REBALANCE · RECONNECT
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">
              Men-to-men massage therapy appointments in Indore, Ujjain and Dewas. View therapies,
              meet the team, and contact the concierge for appointment details.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-[var(--brand-ink)] font-medium">
                <ShieldCheck className="w-4 h-4 text-[var(--brand-ink)]" />
                <span>Men-to-men massage appointments</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--brand-ink)] font-medium">
                <Calendar className="w-4 h-4 text-[var(--brand-ink)]" />
                <span>Online appointment requests</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                Contact the Concierge
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.map(({ label, url, Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#BFA476] hover:bg-brand-500 text-gray-300 hover:text-brand-950 transition-all flex items-center justify-center group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
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
                <button onClick={() => setActiveTab('home')} className="hover:text-[var(--brand-ink)] transition-colors flex items-center gap-1">
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-[var(--brand-ink)] transition-colors">
                  Therapies & Menu
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[var(--brand-ink)] transition-colors">
                  About Tripod Wellness
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-[var(--brand-ink)] transition-colors">
                  Facility Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blog')} className="hover:text-[var(--brand-ink)] transition-colors">
                  Wellness Journal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('faq')} className="hover:text-[var(--brand-ink)] transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[var(--brand-ink)] transition-colors">
                  Concierge & Service Area
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
                    className="hover:text-[var(--brand-ink)] transition-colors text-left flex items-center justify-between w-full group"
                  >
                    <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">{srv.title}</span>
                    <span className="text-[var(--brand-ink)] font-mono shrink-0">{currencySymbol}{srv.price}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-500/15 border border-[#BFA476]/40 text-[var(--brand-ink)] hover:bg-brand-500 hover:text-brand-950 transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Request Appointment</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 4: Contact Information */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-serif font-bold text-base border-b border-white/10 pb-2.5">
              Service Area & Concierge
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--brand-ink)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings?.address || 'Indore, Ujjain & Dewas service area'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--brand-ink)] shrink-0" />
                <a href={`tel:${settings?.phone}`} className="hover:text-white transition-colors">
                  {settings?.phone || '+91-9171606807'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--brand-ink)] shrink-0" />
                <a href={`mailto:${settings?.email}`} className="hover:text-white transition-colors truncate">
                  {settings?.email || 'wellnesstripod@gmail.com'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[var(--brand-ink)] shrink-0" />
                <span>{publicWorkingHours(settings?.workingHours)}</span>
              </div>
            </div>

            {/* Google Map Link Preview */}
            {settings?.googleMapsUrl && (
              <div className="pt-1">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl overflow-hidden border border-white/10 hover:border-[#BFA476] transition-colors bg-[#1B1611] p-3 text-center group"
                >
                  <span className="text-xs font-semibold text-gray-300 group-hover:text-[var(--brand-ink)] transition-colors flex items-center justify-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--brand-ink)]" /> Open map search
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Copyright & Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {settings?.businessName || 'Tripod Wellness'}. All Rights Reserved.</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-400">Men-to-men massage therapy</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms-and-conditions" className="hover:text-gray-300 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-gray-300 transition-colors">
              Refunds
            </Link>
            <span>•</span>
            <Link to="/cookie-policy" className="hover:text-gray-300 transition-colors">
              Cookies
            </Link>
            {analyticsConfigured() && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('tripod-open-consent'))}
                  className="hover:text-gray-300 transition-colors"
                >
                  Cookie settings
                </button>
              </>
            )}
            <span>•</span>
            <Link
              to="/admin-login"
              className="hover:text-[var(--brand-ink)] transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-[var(--brand-ink)]" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

