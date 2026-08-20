import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock, MapPin, Calendar, Menu, X, ChevronDown, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';
import { BusinessSettings, Service } from '../../types';

interface HeaderProps {
  settings: BusinessSettings;
  services: Service[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  onOpenLookupBooking?: () => void;
}

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Therapies', hasMega: true },
    { id: 'about', label: 'About Us' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'blog', label: 'Wellness Blog' },
    { id: 'contact', label: 'Contact' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full font-sans">
      {/* Pre-Header Bar */}
      <div className="bg-[#1A1A1A] text-gray-300 text-xs py-2 px-4 border-b border-gray-800 hidden lg:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 hover:text-[#2CB5A0] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#2CB5A0]" />
              <span>{settings.phone}</span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-[#2CB5A0] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#2CB5A0]" />
              <span>{settings.email}</span>
            </a>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-[#C7A36A]" />
              <span>{settings.workingHours}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Licensed & Certified Male Therapists</span>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
              <MapPin className="w-3.5 h-3.5 text-[#2CB5A0]" />
              <span className="text-gray-300">{settings.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-teal-50/50'
            : 'bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt="Tripod Wellness"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="block font-serif font-extrabold text-xl tracking-wider text-[#1A1A1A] group-hover:text-[#2CB5A0] transition-colors">
                TRIPOD WELLNESS
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-[#C7A36A] uppercase -mt-0.5">
                Men's Spa Sanctuary
              </span>
            </div>
          </button>

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
                    <button
                      id="nav-mega-therapies-btn"
                      onClick={() => setActiveTab('services')}
                      aria-expanded={megaMenuOpen}
                      aria-haspopup="true"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                        activeTab === 'services'
                          ? 'text-[#2CB5A0] bg-teal-50/80 font-semibold'
                          : 'text-gray-700 hover:text-[#2CB5A0] hover:bg-gray-50'
                      }`}
                    >
                      <span>Therapies</span>
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {megaMenuOpen && (
                      <div className="absolute top-full left-0 w-145 bg-white rounded-2xl shadow-2xl border border-teal-100 p-5 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="col-span-2 pb-2 mb-1 border-b border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Curated Massage Treatments
                          </span>
                          <button
                            onClick={() => {
                              setActiveTab('services');
                              setMegaMenuOpen(false);
                            }}
                            className="text-xs font-semibold text-[#2CB5A0] hover:underline"
                          >
                            View All Services →
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
                            className="text-left p-2.5 rounded-xl hover:bg-teal-50/60 transition-all flex items-start gap-3 group/item border border-transparent hover:border-teal-100"
                          >
                            <img
                              src={srv.imageUrl}
                              alt={srv.title}
                              className="w-12 h-12 rounded-lg object-cover group-hover/item:scale-105 transition-transform"
                            />
                            <div>
                              <div className="text-sm font-bold text-gray-900 group-hover/item:text-[#2CB5A0] transition-colors leading-snug">
                                {srv.title}
                              </div>
                              <div className="text-xs text-gray-500 font-medium mt-0.5">
                                {srv.durationMinutes} mins • ₹{srv.price}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'text-[#2CB5A0] bg-teal-50/80 font-semibold'
                      : 'text-gray-700 hover:text-[#2CB5A0] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
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
                <Clock className="w-3.5 h-3.5 text-[#2CB5A0]" />
                <span>My Reservation</span>
              </button>
            )}

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

            <button
              id="header-book-cta-btn"
              onClick={() => onOpenBooking()}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#2CB5A0] to-[#1a6e61] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
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
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                    activeTab === item.id
                      ? 'bg-teal-50 text-[#2CB5A0] font-bold'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
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
                  <Clock className="w-4 h-4 text-[#2CB5A0]" />
                  <span>Look Up / Manage Reservation</span>
                </button>
              )}

              <button
                id="mobile-book-cta-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3.5 rounded-xl bg-[#2CB5A0] text-white font-bold text-center shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment Now</span>
              </button>

              <a
                href={`tel:${settings.phone}`}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-800 font-semibold text-center flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Phone className="w-4 h-4 text-[#2CB5A0]" />
                <span>Call Us: {settings.phone}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
