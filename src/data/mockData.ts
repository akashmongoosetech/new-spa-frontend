import { BusinessSettings } from '../types';

/**
 * Local fallback only. The public site replaces these values with the live
 * business settings returned by the API. Contact details are the published
 * concierge details; unverified social profiles and location claims are left
 * empty on purpose.
 */
export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'Tripod Wellness',
  tagline: "Men's massage therapy in Indore, Ujjain and Dewas",
  phone: '+91-9171606807',
  whatsapp: '+91-9171606807',
  email: 'wellnesstripod@gmail.com',
  address: 'Indore, Ujjain & Dewas',
  city: 'Indore, Ujjain, Dewas',
  workingHours: 'By appointment only',
  currencySymbol: '₹',
  currencyCode: 'INR',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Indore+Ujjain+Dewas',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  smtpConfigured: false,
  maxBookingsPerSlot: 3,
  slotIntervalMinutes: 60,
  autoApproveBookings: false,
};

export const mockSettings = DEFAULT_SETTINGS;
export default mockSettings;
