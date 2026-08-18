import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookingPage as OriginalBookingPage } from '../BookingPage';
import { getServices, getTherapists, getSettings } from '../../services/api';
import { mockSettings as defaultSettings } from '../../data/mockData';
import { BusinessSettings, Service, Therapist } from '../../types';

export const BookingPageWrapper: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get('service') || undefined;

  useEffect(() => {
    async function fetchData() {
      try {
        const [svc, thp, st] = await Promise.all([
          getServices(),
          getTherapists(),
          getSettings()
        ]);
        if (Array.isArray(svc)) setServices(svc);
        if (Array.isArray(thp)) setTherapists(thp);
        if (st) setSettings(st);
      } catch (err) {
        console.error('Failed to fetch booking data:', err);
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
      initialServiceId={initialServiceId}
    />
  );
};

export default BookingPageWrapper;
