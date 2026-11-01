import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SpaAssistantChat } from '../ai/SpaAssistantChat';
import { Modal } from '../ui/Modal';
import { Toast, ToastMessage } from '../ui/Toast';
import { playNotificationSound } from '../../utils/toastEvents';
import { BookingWizard } from '../booking/BookingWizard';
import { BookingLookupModal } from '../booking/BookingLookupModal';
import { CookieConsent } from '../consent/CookieConsent';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';
import { trackPageView, markConversionPending } from '../../utils/analytics';
import { Service, Therapist, BusinessSettings, Booking } from '../../types';

export interface LayoutProps {
  children?: React.ReactNode;
  settings?: BusinessSettings;
  services?: Service[];
  therapists?: Therapist[];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenBooking?: (serviceId?: string) => void;
  onOpenLookupBooking?: () => void;
  onSubscribeNewsletter?: (email: string, consent: boolean, website?: string) => Promise<void>;
  showAssistantChat?: boolean;
}

type CatalogResource = 'services' | 'therapists' | 'settings';

// React StrictMode mounts public effects twice in development. Share the
// in-flight request so the first page load never fires duplicate catalog calls.
const catalogInFlight: Partial<Record<CatalogResource, Promise<unknown>>> = {};

function loadCatalogResource<T>(key: CatalogResource, loader: () => Promise<T>): Promise<T> {
  const existing = catalogInFlight[key];
  if (existing) return existing as Promise<T>;

  const request = loader().finally(() => {
    if (catalogInFlight[key] === request) delete catalogInFlight[key];
  });
  catalogInFlight[key] = request;
  return request;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  settings: propSettings,
  services: propServices,
  therapists: propTherapists,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onOpenBooking: propOnOpenBooking,
  onOpenLookupBooking: propOnOpenLookupBooking,
  onSubscribeNewsletter: propOnSubscribeNewsletter,
  showAssistantChat = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<BusinessSettings>(propSettings || mockSettings);
  const [services, setServices] = useState<Service[]>(propServices || []);
  const [therapists, setTherapists] = useState<Therapist[]>(propTherapists || []);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [therapistsLoading, setTherapistsLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [therapistsError, setTherapistsError] = useState(false);
  const [settingsError, setSettingsError] = useState(false);
  const [catalogError, setCatalogError] = useState('');
  const [catalogRetryToken, setCatalogRetryToken] = useState(0);

  // Load the public catalog independently so one slow endpoint does not hold
  // back data from the other sections. Failures are surfaced instead of being
  // silently converted into "empty" data.
  useEffect(() => {
    let cancelled = false;
    const markFailed = () => {
      if (!cancelled) {
        setCatalogError('Some live content could not be loaded right now.');
      }
    };

    setCatalogError('');
    setServicesError(false);
    setTherapistsError(false);
    setSettingsError(false);
    setServicesLoading(true);
    setTherapistsLoading(true);
    setSettingsLoading(true);

    loadCatalogResource('services', () => api.getServices())
      .then((svc) => {
        if (!cancelled && Array.isArray(svc)) setServices(svc);
      })
      .catch(() => {
        if (!cancelled) setServicesError(true);
        markFailed();
      })
      .finally(() => {
        if (!cancelled) setServicesLoading(false);
      });

    loadCatalogResource('therapists', () => api.getTherapists())
      .then((thp) => {
        if (!cancelled && Array.isArray(thp)) setTherapists(thp);
      })
      .catch(() => {
        if (!cancelled) setTherapistsError(true);
        markFailed();
      })
      .finally(() => {
        if (!cancelled) setTherapistsLoading(false);
      });

    loadCatalogResource('settings', () => api.getSettings())
      .then((st) => {
        if (!cancelled && st) setSettings(st);
      })
      .catch(() => {
        if (!cancelled) setSettingsError(true);
        markFailed();
      })
      .finally(() => {
        if (!cancelled) setSettingsLoading(false);
      });

    return () => { cancelled = true; };
  }, [catalogRetryToken]);

  const retryCatalog = () => setCatalogRetryToken((value) => value + 1);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>();

  const addToast = (
    type: 'success' | 'error' | 'info' | 'admin_alert',
    message: string,
    title?: string,
    options?: Partial<ToastMessage>
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const defaultTitle =
      type === 'admin_alert'
        ? '🔔 New Incoming Appointment'
        : type === 'success'
        ? 'Success'
        : type === 'error'
        ? 'Error'
        : 'Notice';
    setToasts((prev) => [
      ...prev,
      { id, type, title: title || defaultTitle, message, ...options },
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { type = 'info', title, message, ...rest } = customEvent.detail;
        if (type === 'admin_alert' || type === 'success') {
          playNotificationSound(type);
        }
        addToast(type, message, title, rest);
      }
    };

    const handleNewBooking = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.booking) {
        const b = customEvent.detail.booking;
        playNotificationSound('success');
        addToast(
          'success',
          `Appointment request #${b.bookingNumber || b.id} received for ${b.firstName} (${b.serviceTitle || 'Massage'} on ${b.date} @ ${b.timeSlot}).`,
          'Booking request received',
          {
            bookingRef: b.bookingNumber || b.id,
            actionLabel: 'View status',
            onAction: () => {
              setIsLookupOpen(true);
            },
          }
        );
      }
    };

    window.addEventListener('aura-toast', handleCustomToast);
    window.addEventListener('aura-new-booking', handleNewBooking);

    return () => {
      window.removeEventListener('aura-toast', handleCustomToast);
      window.removeEventListener('aura-new-booking', handleNewBooking);
    };
  }, []);

  const handleOpenBooking = (serviceId?: string) => {
    if (services.length === 0 && servicesLoading) {
      addToast('info', 'The live therapy menu is still loading. Please try again in a moment.');
      return;
    }
    if (services.length === 0 && servicesError) {
      addToast('error', 'The live therapy menu could not be loaded. Please use Retry above.');
      return;
    }
    if (services.length === 0) {
      addToast('info', 'No therapies are currently available online. Please contact the concierge.');
      return;
    }
    if (propOnOpenBooking) {
      propOnOpenBooking(serviceId);
    } else {
      setBookingServiceId(serviceId);
      setIsBookingOpen(true);
    }
  };

  const handleOpenLookupBooking = () => {
    if (propOnOpenLookupBooking) {
      propOnOpenLookupBooking();
    } else {
      setIsLookupOpen(true);
    }
  };

  const getActiveTabFromPath = (path: string) => {
    if (path === '/') return 'home';
    const clean = path.replace(/^\//, '').split('/')[0];
    return clean || 'home';
  };

  const activeTab = propActiveTab || getActiveTabFromPath(location.pathname);

  const TAB_ROUTES: Record<string, string> = {
    home: '/',
    services: '/services',
    about: '/about',
    gallery: '/gallery',
    therapists: '/therapists',
    booking: '/booking',
    contact: '/contact',
    blog: '/blog',
    faq: '/faq',
    privacy: '/privacy-policy',
    terms: '/terms-and-conditions',
    refund: '/refund-policy',
    cookie: '/cookie-policy',
    admin: '/admin/dashboard',
  };

  const handleNavigateTab = (tab: string) => {
    if (propSetActiveTab) {
      propSetActiveTab(tab);
    } else {
      navigate(TAB_ROUTES[tab] ?? (tab === 'home' ? '/' : `/${tab}`));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const track = () => trackPageView(`${location.pathname}${location.search}`);
    track();
    window.addEventListener('tripod-consent-change', track);
    return () => window.removeEventListener('tripod-consent-change', track);
  }, [location.pathname, location.search]);

  const handleSubscribeNewsletter = async (email: string, consent: boolean, website?: string) => {
    if (propOnSubscribeNewsletter) {
      await propOnSubscribeNewsletter(email, consent, website);
      return;
    }
    try {
      await api.subscribeNewsletter(email, consent, website);
      markConversionPending('newsletter');
      navigate('/thank-you?type=newsletter', { replace: true });
    } catch (err: any) {
      addToast('error', err?.message || 'Failed to subscribe. Please try again.');
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1A1A1A] font-sans antialiased selection:bg-brand-500 selection:text-brand-950">
      <Toast toasts={toasts} onClose={removeToast} />

      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        settings={settings}
        services={services}
        onOpenBooking={handleOpenBooking}
        onOpenLookupBooking={handleOpenLookupBooking}
      />

      <main className="flex-grow">
        {catalogError && (
          <div className="border-b border-amber-200 bg-amber-50">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-xs text-amber-900 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>{catalogError} The rest of the page is still available.</p>
              <button
                type="button"
                onClick={retryCatalog}
                className="self-start rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-bold text-amber-900 transition-colors hover:bg-amber-100 sm:self-auto"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        {children || (
          <Outlet
            context={{
              services,
              therapists,
              settings,
              servicesLoading,
              therapistsLoading,
              settingsLoading,
              servicesError,
              therapistsError,
              settingsError,
              catalogError,
              retryCatalog,
              onOpenBooking: handleOpenBooking,
              addToast,
            }}
          />
        )}
      </main>

      <Footer
        settings={settings}
        services={services}
        setActiveTab={handleNavigateTab}
        onSubscribeNewsletter={handleSubscribeNewsletter}
        onOpenBooking={() => handleOpenBooking()}
      />

      {showAssistantChat && (
        <SpaAssistantChat
          services={services}
          therapists={therapists}
          onOpenBooking={handleOpenBooking}
        />
      )}

      {isBookingOpen && (
        <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} maxWidth="4xl">
          <BookingWizard
            services={services}
            therapists={therapists}
            initialServiceId={bookingServiceId}
            onBookingSuccess={(booking: Booking) => {
              addToast('success', 'Booking request received. The concierge will confirm availability by email.');
              setIsBookingOpen(false);
            }}
            onClose={() => setIsBookingOpen(false)}
          />
        </Modal>
      )}

      {isLookupOpen && (
        <BookingLookupModal
          isOpen={isLookupOpen}
          onClose={() => setIsLookupOpen(false)}
          therapists={therapists}
          services={services}
        />
      )}

      <CookieConsent />
    </div>
  );
};

export default Layout;
