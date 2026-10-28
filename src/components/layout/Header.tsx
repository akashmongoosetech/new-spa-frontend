import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Calendar, Menu, X, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { BusinessSettings, Service } from '../../types';
import { BrandLogo } from '../brand/BrandLogo';
import { publicWorkingHours } from '../../utils/settings';

interface HeaderProps {
  settings: BusinessSettings;
  services: Service[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  onOpenLookupBooking?: () => void;
}

const NAV_PATHS: Record<string, string> = {
  home: '/',
  services: '/services',
  therapists: '/therapists',
  about: '/about',
  gallery: '/gallery',
  blog: '/blog',
  contact: '/contact',
  faq: '/faq',
};

const ABOUT_LINKS = [
  { id: 'therapists', label: 'Therapists' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'blog', label: 'Blogs' },
  { id: 'faq', label: 'FAQ' },
];

export const Header: React.FC<HeaderProps> = ({
  settings,
  services,
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenLookupBooking,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setAboutMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (!mobileMenuOpen) setMobileAboutOpen(false);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!aboutMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAboutMenuOpen(false);
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('[data-about-menu]')) {
        setAboutMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [aboutMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Therapies', hasMega: true },
    { id: 'about', label: 'About', hasAboutMenu: true },
    { id: 'contact', label: 'Contact' },
  ];

  const aboutGroupActive = ['about', 'therapists', 'gallery', 'blog', 'faq'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 w-full font-sans">
      {/* Pre-Header Bar */}
      <div className="on-dark-brand bg-[#1A1A1A] text-gray-300 text-xs py-2 px-4 border-b border-gray-800 hidden lg:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 hover:text-[var(--brand-ink)] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[var(--brand-ink)]" />
              <span>{settings.phone}</span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-[var(--brand-ink)] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[var(--brand-ink)]" />
              <span>{settings.email}</span>
            </a>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-[var(--brand-ink)]" />
              <span>{publicWorkingHours(settings.workingHours)}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
              <MapPin className="w-3.5 h-3.5 text-[var(--brand-ink)]" />
              <span className="text-gray-300">{settings.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-brand-50/50'
            : 'bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            id="brand-logo-btn"
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-15 h-15 rounded-xl bg-white p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <BrandLogo
                variant="icon"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="block font-serif font-extrabold text-xl tracking-wider text-[#1A1A1A] group-hover:text-[var(--brand-ink)] transition-colors">
                TRIPOD WELLNESS
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-[var(--brand-ink)] uppercase -mt-0.5">
                RESTORE · REBALANCE · RECONNECT
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.hasMega) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                    onFocus={() => setMegaMenuOpen(true)}
                    onBlur={() => setTimeout(() => setMegaMenuOpen(false), 150)}
                  >
                    <Link
                      id="nav-mega-therapies-btn"
                      to="/services"
                      onClick={() => setMegaMenuOpen(false)}
                      aria-expanded={megaMenuOpen}
                      aria-haspopup="true"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                        activeTab === 'services'
                          ? 'text-[var(--brand-ink)] bg-brand-50/80 font-semibold'
                          : 'text-gray-700 hover:text-[var(--brand-ink)] hover:bg-gray-50'
                      }`}
                    >
                      <span>Therapies</span>
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {megaMenuOpen && (
                      <div className="absolute top-full left-0 w-145 bg-white rounded-2xl shadow-2xl border border-brand-100 p-5 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="col-span-2 pb-2 mb-1 border-b border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Massage Therapies
                          </span>
                          <button
                            onClick={() => {
                              setActiveTab('services');
                              setMegaMenuOpen(false);
                            }}
                            className="text-xs font-semibold text-[var(--brand-ink)] hover:underline"
                          >
                            View All Therapies →
                          </button>
                        </div>
                        {(services || []).slice(0, 6).map((srv) => (
                          <button
                            key={srv.id}
                            id={`mega-item-${srv.id}`}
                            onClick={() => {
                              setActiveTab('services');
                              setMegaMenuOpen(false);
                              onOpenBooking(srv.id);
                            }}
                            className="text-left p-2.5 rounded-xl hover:bg-brand-50/60 transition-all flex items-start gap-3 group/item border border-transparent hover:border-brand-100"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-[var(--brand-ink)]">
                              <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900 group-hover/item:text-[var(--brand-ink)] transition-colors leading-snug">
                                {srv.title}
                              </div>
                              <div className="text-xs text-gray-500 font-medium mt-0.5">
                                {srv.durationMinutes} mins • {settings.currencySymbol || '₹'}{srv.price}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.hasAboutMenu) {
                return (
                  <div
                    key={item.id}
                    data-about-menu
                    className="relative"
                    onMouseEnter={() => setAboutMenuOpen(true)}
                    onMouseLeave={() => setAboutMenuOpen(false)}
                    onFocus={() => setAboutMenuOpen(true)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setAboutMenuOpen(false);
                      }
                    }}
                  >
                    <Link
                      id="nav-about-btn"
                      to="/about"
                      onClick={() => setAboutMenuOpen(false)}
                      aria-expanded={aboutMenuOpen}
                      aria-haspopup="true"
                      aria-controls="about-dropdown"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                        aboutGroupActive
                          ? 'text-[var(--brand-ink)] bg-brand-50/80 font-semibold'
                          : 'text-gray-700 hover:text-[var(--brand-ink)] hover:bg-gray-50'
                      }`}
                    >
                      <span>About</span>
                      <ChevronDown
                        className={`w-4 h-4 opacity-70 transition-transform ${
                          aboutMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </Link>

                    {aboutMenuOpen && (
                      <div
                        id="about-dropdown"
                        className="absolute top-full left-0 w-56 rounded-2xl border border-brand-100 bg-white p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <div className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Explore
                        </div>
                        {ABOUT_LINKS.map((link) => (
                          <Link
                            key={link.id}
                            id={`nav-about-${link.id}`}
                            to={NAV_PATHS[link.id]}
                            onClick={() => setAboutMenuOpen(false)}
                            className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
                              activeTab === link.id
                                ? 'bg-brand-50 text-[var(--brand-ink)] font-semibold'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-ink)]'
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  to={NAV_PATHS[item.id] || '/'}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'text-[var(--brand-ink)] bg-brand-50/80 font-semibold'
                      : 'text-gray-700 hover:text-[var(--brand-ink)] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onOpenLookupBooking && (
              <button
                id="header-lookup-cta-btn"
                onClick={onOpenLookupBooking}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View, Reschedule or Cancel your Booking"
              >
                <Clock className="w-3.5 h-3.5 text-[var(--brand-ink)]" />
                <span>My Reservation</span>
              </button>
            )}

            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </a>
            )}

            <button
              id="header-book-cta-btn"
              onClick={() => onOpenBooking()}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#C3AA7E] to-[#BFA476] text-brand-950 font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Request Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="xl:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-gray-200 px-4 py-5 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex flex-col gap-1.5 mb-5">
              {navItems.map((item) => {
                if (item.hasAboutMenu) {
                  return (
                    <div key={item.id}>
                      <button
                        id="mobile-nav-about"
                        type="button"
                        onClick={() => setMobileAboutOpen((open) => !open)}
                        aria-expanded={mobileAboutOpen}
                        aria-controls="mobile-about-menu"
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${
                          aboutGroupActive
                            ? 'bg-brand-50 text-[var(--brand-ink)] font-bold'
                            : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <span>About</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            mobileAboutOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {mobileAboutOpen && (
                        <div
                          id="mobile-about-menu"
                          className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-brand-100 pl-2"
                        >
                          <Link
                            to="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--brand-ink)]"
                          >
                            About Overview
                          </Link>
                          {ABOUT_LINKS.map((link) => (
                            <Link
                              key={link.id}
                              to={NAV_PATHS[link.id]}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                activeTab === link.id
                                  ? 'bg-brand-50 text-[var(--brand-ink)] font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-ink)]'
                              }`}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    to={NAV_PATHS[item.id] || '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-left px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                      activeTab === item.id
                        ? 'bg-brand-50 text-[var(--brand-ink)] font-bold'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {onOpenLookupBooking && (
                <button
                  id="mobile-lookup-cta-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLookupBooking();
                  }}
                  className="w-full py-3 rounded-xl border border-gray-200 text-gray-800 font-bold text-center text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <Clock className="w-4 h-4 text-[var(--brand-ink)]" />
                  <span>Look Up / Manage Reservation</span>
                </button>
              )}

              <button
                id="mobile-book-cta-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3.5 rounded-xl bg-brand-500 text-brand-950 font-bold text-center shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Request Appointment</span>
              </button>

              <a
                href={`tel:${settings.phone}`}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-800 font-semibold text-center flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Phone className="w-4 h-4 text-[var(--brand-ink)]" />
                <span>Call Us: {settings.phone}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
