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
import { mockServices, mockTherapists, mockSettings } from '../../data/mockData';
import { api } from '../../services/api';
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
  onSubscribeNewsletter?: (email: string) => Promise<void>;
  showAssistantChat?: boolean;
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
  const [services, setServices] = useState<Service[]>(propServices || mockServices);
  const [therapists, setTherapists] = useState<Therapist[]>(propTherapists || mockTherapists);

  // Load real data from the API when this layout is used without injected props.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [svc, thp, st] = await Promise.all([
          api.getServices().catch(() => []),
          api.getTherapists().catch(() => []),
          api.getSettings().catch(() => null),
        ]);
        if (cancelled) return;
        if (Array.isArray(svc) && svc.length > 0) setServices(svc);
        if (Array.isArray(thp) && thp.length > 0) setTherapists(thp);
        if (st) setSettings(st);
      } catch (err) {
        // keep mock fallbacks
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
          `Appointment #${b.bookingNumber || b.id} confirmed for ${b.firstName} (${b.serviceTitle || 'Massage'} on ${b.date} @ ${b.timeSlot}).`,
          '🎉 Booking Confirmed!',
          {
            bookingRef: b.bookingNumber || b.id,
            actionLabel: 'View Pass',
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

  const handleNavigateTab = (tab: string) => {
    if (propSetActiveTab) {
      propSetActiveTab(tab);
    } else {
      if (tab === 'home') navigate('/');
      else navigate(`/${tab}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSubscribeNewsletter = async (email: string) => {
    if (propOnSubscribeNewsletter) {
      await propOnSubscribeNewsletter(email);
      return;
    }
    try {
      await api.subscribeNewsletter(email);
      addToast('success', `Subscribed ${email} to Aura Luxe updates!`);
    } catch (err: any) {
      addToast('error', err?.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1A1A1A] font-sans antialiased selection:bg-[#2CB5A0] selection:text-white">
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
        {children || (
          <Outlet
            context={{
              services,
              therapists,
              settings,
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
              addToast('success', `Appointment confirmed for ${booking.firstName} ${booking.lastName}!`);
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
    </div>
  );
};

export default Layout;
