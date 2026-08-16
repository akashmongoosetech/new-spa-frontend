export interface Service {
  id: string;
  title: string;
  slug: string;
  category: 'relaxation' | 'deep_tissue' | 'specialized' | 'vip_packages' | 'ayurvedic';
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  durationMinutes: number;
  benefits: string[];
  includedItems: string[];
  imageUrl: string;
  featured: boolean;
  active: boolean;
  rating: number;
  reviewsCount: number;
  faq?: { question: string; answer: string }[];
}

export interface Therapist {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  bio: string;
  specialties: string[];
  imageUrl: string;
  photoUrl?: string;
  gallery?: string[];
  featured?: boolean;
  rating: number;
  reviewCount: number;
  availableDays: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  availability?: {
    workingDays: string[];
    timeSlots: string[];
  };
  active: boolean;
}

export interface TimeSlot {
  time: string; // e.g. "10:00 AM"
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  available: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  serviceId: string;
  serviceTitle: string;
  therapistId: string;
  therapistName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  durationMinutes: number;
  price: number;
  discountAmount: number;
  totalPaid: number;
  couponCode?: string;
  additionalNotes?: string;
  paymentMethod: 'pay_at_venue' | 'credit_card' | 'upi' | 'paypal';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingAmount: number;
  validUntil: string;
  active: boolean;
  usageCount: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  rating: number;
  comment: string;
  serviceTitle: string;
  date: string;
  avatarUrl?: string;
  approved: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  imageUrl: string;
  tags: string[];
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'in_progress' | 'replied' | 'closed';
  createdAt: string;
  repliedAt?: string;
  replyMessage?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  type: 'booking_confirmation' | 'contact_thankyou' | 'newsletter_welcome' | 'booking_status_update' | 'booking_reminder';
  sentAt: string;
  htmlContent: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  workingHours: string;
  currencySymbol: string;
  currencyCode: string;
  googleMapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  
  // SMTP & Email
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpSenderName?: string;
  smtpSenderEmail?: string;
  smtpConfigured: boolean;
  bookingEmailTemplate?: string;
  contactEmailTemplate?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
  twitterCard?: string;
  enableJsonLd?: boolean;
  robotsTxt?: string;

  // Booking & Schedule
  maxBookingsPerSlot: number;
  slotIntervalMinutes: number;
  autoApproveBookings: boolean;
  bookingDurationMinutes?: number;
  maxDailyBookings?: number;
  advanceBookingDays?: number;
  cancellationNoticeHours?: number;

  // Security
  sessionTimeoutMinutes?: number;
  maxLoginAttempts?: number;
  enable2FA?: boolean;

  // Appearance
  primaryColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  heroBannerUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;

  // Payment gateways
  paymentGateways?: {
    payAtVenue: boolean;
    upiQrCode: boolean;
    razorpayEnabled: boolean;
    stripeEnabled: boolean;
  };
}

export interface SystemAuditLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'receptionist';
  status: 'active' | 'inactive';
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  lastLoginIp?: string;
}

export interface NotificationItem {
  id: string;
  type: 'booking' | 'contact' | 'cancellation' | 'newsletter' | 'login' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
  relatedId?: string;
}

export interface ScheduleConfig {
  blockedDates: string[]; // ['YYYY-MM-DD']
  holidays: { date: string; title: string }[];
  emergencyClosure: boolean;
  emergencyClosureReason?: string;
  timeSlots: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
}

export interface LoginActivity {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed';
  deviceInfo?: string;
}
