import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingPage as OriginalBookingPage } from '../BookingPage';
import { getServices, getTherapists, getSettings } from '../../services/api';
import { mockServices, mockTherapists, mockSettings as defaultSettings } from '../../data/mockData';
import { BusinessSettings } from '../../types';

export const BookingPageWrapper: React.FC = () => {
  const [services, setServices] = useState<typeof mockServices>(mockServices);
  const [therapists, setTherapists] = useState<typeof mockTherapists>(mockTherapists);
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [svc, thp, st] = await Promise.all([
          getServices(),
          getTherapists(),
          getSettings()
        ]);
        setServices(svc);
        setTherapists(thp);
        setSettings(st);
      } catch (err) {
        console.error('Failed to fetch booking data:', err);
        // Keep mock data as fallback
      }
    }
    fetchData();
  }, []);

  const context = {
    services,
    therapists,
    settings,
    onOpenBooking: (serviceId: string) => {
      navigate(`/booking?service=${serviceId}`);
    }
  };

  return (
    <OriginalBookingPage
      {...context}
    />
  );
};

export default BookingPageWrapper;
