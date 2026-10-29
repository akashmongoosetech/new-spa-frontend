import axios from 'axios';
import {
  Service,
  Therapist,
  Booking,
  Coupon,
  Testimonial,
  BlogPost,
  BlogCategory,
  BlogPublicDetail,
  PaginatedBlogPosts,
  ContactMessage,
  BusinessSettings,
  EmailLog,
  SystemAuditLog,
  NewsletterSubscriber,
  LoginActivity,
  AdminUser,
  StaffApplication,
  NotificationItem,
  ScheduleConfig
} from '../types';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://new-spa-backend.onrender.com/api' : '/api');
const TOKEN_KEY = 'aura_admin_token';
const USER_KEY = 'aura_admin_user';

const http = axios.create({ baseURL: API_BASE, withCredentials: true, timeout: 20000 });

// Attach the stored JWT (if any) to every request.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend rejects a token, drop the stored session.
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      const hadSession = Boolean(localStorage.getItem(TOKEN_KEY));
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      // Only force a redirect out of the admin console (and only if we just
      // dropped a session), so public pages and login stay usable.
      if (
        hadSession &&
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.startsWith('/admin-login')
      ) {
        window.location.assign('/admin-login');
      }
    }
    return Promise.reject(error);
  }
);

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    return data?.error || data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

// ---------- Response mappers (backend snake_case -> frontend camelCase) ----------

function mapService(s: any): Service {
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    category: s.category,
    shortDescription: s.short_description,
    fullDescription: s.full_description,
    price: s.price,
    originalPrice: s.original_price,
    durationMinutes: s.duration_minutes,
    benefits: s.benefits || [],
    includedItems: s.included_items || [],
    imageUrl: s.image_url,
    featured: s.featured === 1,
    // Backend serializes active as 0/1 (not a boolean), so `!== false` treats
    // a deactivated record (0) as active.
    active: s.active === 1 || s.active === true,
    rating: s.rating,
    reviewsCount: s.reviews_count,
    faq: s.faq || []
  };
}

function mapTherapist(t: any): Therapist {
  return {
    id: t.id,
    name: t.name,
    title: t.title,
    experienceYears: t.experience_years || 5,
    bio: t.bio || '',
    specialties: t.specialties || [],
    imageUrl: t.image_url || t.photoUrl,
    photoUrl: t.photoUrl,
    gallery: t.gallery,
    featured: t.featured === 1,
    rating: t.rating,
    reviewCount: t.reviews_count,
    availableDays: t.availableDays || [],
    // Backend serializes active as 0/1, so compare explicitly.
    active: t.active === 1 || t.active === true
  };
}

function mapBooking(b: any): Booking {
  const fullName = b.customerName || '';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || fullName || b.firstName || '';
  const lastName = nameParts.slice(1).join(' ') || b.lastName || '';
  return {
    id: b.id,
    bookingNumber: b.bookingNumber,
    firstName,
    lastName,
    email: b.email,
    phone: b.phone,
    age: b.age,
    gender: b.gender,
    serviceId: b.serviceId,
    serviceTitle: b.serviceTitle,
    therapistId: b.therapistId,
    therapistName: b.therapistName,
    date: b.date,
    timeSlot: b.timeSlot,
    durationMinutes: b.durationMinutes,
    price: b.totalPaid,
    discountAmount: b.discountAmount || 0,
    totalPaid: b.totalPaid || 0,
    couponCode: b.couponCode,
    additionalNotes: b.notes || b.additionalNotes,
    paymentMethod: b.paymentMethod || 'pay_at_venue',
    paymentStatus: b.paymentStatus || 'pending',
    status: b.status || 'pending',
    createdAt: b.createdAt
  };
}

function mapTestimonial(t: any): Testimonial {
  return {
    id: t.id,
    clientName: t.name || t.clientName,
    role: t.role,
    rating: t.rating,
    comment: t.comment,
    serviceTitle: t.serviceTitle || t.service_title || '',
    date: t.date || t.created_at,
    avatarUrl: t.avatarUrl || t.avatar_url,
    approved: t.approved === 1 || t.approved === true
  };
}

function blogStatusOf(b: any): BlogPost['status'] {
  if (b.status === 'published' || b.status === 'draft' || b.status === 'unpublished') return b.status;
  if (b.status === 'inactive') return 'unpublished';
  return b.published === false || b.published === 0 ? 'draft' : 'published';
}

function mapBlogPost(b: any): BlogPost {
  const status = blogStatusOf(b);
  const readingTime = Number(b.readingTime || b.reading_time || 0) || undefined;
  const readTime = b.read_time || b.readTime || (readingTime ? `${readingTime} min read` : '1 min read');
  const summaryHtml = b.excerpt || b.summary || '';
  const safeExcerpt = b.safe_excerpt || b.excerptText || b.excerpt_text ||
    String(summaryHtml).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const seo = b.seo ? {
    metaTitle: b.seo.meta_title || b.seo.metaTitle || '',
    metaDescription: b.seo.meta_description || b.seo.metaDescription || '',
    canonicalUrl: b.seo.canonical_url || b.seo.canonicalUrl || '',
    ogTitle: b.seo.og_title || b.seo.ogTitle || '',
    ogDescription: b.seo.og_description || b.seo.ogDescription || '',
    ogImageUrl: b.seo.og_image_url || b.seo.ogImageUrl || '',
    twitterTitle: b.seo.twitter_title || b.seo.twitterTitle || '',
    twitterDescription: b.seo.twitter_description || b.seo.twitterDescription || '',
    twitterImageUrl: b.seo.twitter_image_url || b.seo.twitterImageUrl || '',
    keywords: b.seo.keywords || [],
  } : undefined;
  const resolved = b.resolved_seo || b.resolvedSeo;
  const imageUrl = b.featured_image_url || b.featuredImageUrl || b.image_url || b.imageUrl || b.cover_image || b.coverImage || '';
  return {
    id: b.id,
    title: b.title || '',
    slug: b.slug || '',
    category: b.category || '',
    categoryId: b.category_id || b.categoryId || '',
    author: b.author || '',
    therapistName: b.therapist_name || b.therapistName || '',
    therapistAvatarUrl: b.therapist_avatar_url || b.therapistAvatarUrl || '',
    date: b.published_at || b.publishedAt || b.date || b.created_at || b.createdAt,
    publishedAt: b.published_at || b.publishedAt || undefined,
    readTime,
    readingTime,
    summary: summaryHtml,
    excerptText: b.excerpt_text || b.excerptText || safeExcerpt,
    content: b.content || '',
    imageUrl,
    featuredImageUrl: imageUrl,
    featuredImageAlt: b.featured_image_alt || b.featuredImageAlt || '',
    tags: Array.isArray(b.tags) ? b.tags : [],
    published: status === 'published',
    status,
    isFeatured: b.is_featured === 1 || b.isFeatured === true || b.feature_on_home_page === 1 || b.featureOnHomePage === true,
    featureOnHomePage: b.is_featured === 1 || b.isFeatured === true || b.feature_on_home_page === 1 || b.featureOnHomePage === true,
    sections: Array.isArray(b.sections)
      ? b.sections.map((section: any, index: number) => ({
          id: section.id || `${b.slug || 'section'}-${index + 1}`,
          heading: section.heading || '',
          content: section.content || '',
          order: Number.isFinite(Number(section.order)) ? Number(section.order) : index,
        }))
      : [],
    seo,
    resolvedSeo: resolved ? {
      title: resolved.title,
      description: resolved.description,
      canonicalUrl: resolved.canonical_url || resolved.canonicalUrl,
      canonical_url: resolved.canonical_url || resolved.canonicalUrl,
      robots: resolved.robots,
      ogTitle: resolved.og_title || resolved.ogTitle,
      ogDescription: resolved.og_description || resolved.ogDescription,
      ogImageUrl: resolved.og_image_url || resolved.ogImageUrl,
      ogImageAlt: resolved.og_image_alt || resolved.ogImageAlt,
      twitterTitle: resolved.twitter_title || resolved.twitterTitle,
      twitterDescription: resolved.twitter_description || resolved.twitterDescription,
      twitterImageUrl: resolved.twitter_image_url || resolved.twitterImageUrl,
      twitterCard: resolved.twitter_card || resolved.twitterCard,
      keywords: resolved.keywords || [],
    } : undefined,
    previousSlugs: b.previous_slugs || b.previousSlugs || [],
    safeExcerpt,
    excerptHtml: b.excerpt_html || b.excerptHtml,
    createdAt: b.created_at || b.createdAt,
    updatedAt: b.updated_at || b.updatedAt,
  };
}

function mapContactMessage(c: any): ContactMessage {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone || '',
    subject: c.subject || '',
    message: c.message,
    status: c.status || 'new',
    createdAt: c.created_at,
    repliedAt: c.replied_at,
    replyMessage: c.reply_text
  };
}

function mapCoupon(c: any): Coupon {
  return {
    id: c.id,
    code: c.code,
    discountType: c.discountType === 'percent' ? 'percentage' : (c.discountType || 'fixed'),
    discountValue: c.discount || 0,
    minBookingAmount: c.minAmount || 0,
    validUntil: c.expiryDate || '',
    active: c.active === true || c.active === 1,
    usageCount: c.usageCount || 0
  };
}

/**
 * The legacy settings record still contains a generic superlative tagline and
 * old-brand social handles. Do not repeat unverified positioning or link to a
 * profile that is not clearly associated with this business.
 */
function publicTagline(value: unknown): string {
  const text = String(value || '').trim();
  if (!text || /\b(premier|luxur\w*|elite|exclusive|sanctuary|best)\b/i.test(text)) {
    return "Men's massage therapy in Indore, Ujjain and Dewas";
  }
  return text;
}

function verifiedSocialUrl(value: unknown, hosts: string[]): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (!/^https?:$/.test(url.protocol)) return '';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (!hosts.includes(host)) return '';
    // Keep only profiles that name this business; old-brand handles are hidden.
    return /tripod/i.test(url.pathname) ? url.toString() : '';
  } catch {
    return '';
  }
}
function mapBusinessSettings(s: any): BusinessSettings {
  const base: BusinessSettings = {
    businessName: s.businessName || s.siteName || 'Tripod Wellness',
    tagline: publicTagline(s.tagline),
    phone: s.phone || '+91-9171606807',
    whatsapp: s.whatsapp || s.phone || '+91-9171606807',
    email: s.email || 'wellnesstripod@gmail.com',
    address: s.address || 'Indore, Ujjain, Dewas',
    city: s.city || 'Indore, Ujjain, Dewas',
    workingHours: s.workingHours || s.openingHours || 'By appointment only',
    currencySymbol: s.currencySymbol || '₹',
    currencyCode: s.currencyCode || 'INR',
    googleMapsUrl: s.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=Indore+Ujjain+Dewas',
    facebookUrl: verifiedSocialUrl(s.facebookUrl, ['facebook.com']),
    instagramUrl: verifiedSocialUrl(s.instagramUrl, ['instagram.com']),
    twitterUrl: verifiedSocialUrl(s.twitterUrl, ['twitter.com', 'x.com']),
    smtpHost: s.smtpHost || '',
    smtpPort: s.smtpPort || 587,
    smtpUser: s.smtpUser || '',
    smtpSenderName: s.smtpSenderName || 'Tripod Wellness Concierge',
    smtpSenderEmail: s.smtpSenderEmail || '',
    smtpConfigured: s.smtpConfigured === true,
    bookingEmailSubject: s.bookingEmailSubject || '',
    contactEmailSubject: s.contactEmailSubject || '',
    bookingEmailTemplate: s.bookingEmailTemplate || '',
    contactEmailTemplate: s.contactEmailTemplate || '',
    maxBookingsPerSlot: s.maxBookingsPerSlot || 3,
    slotIntervalMinutes: s.slotIntervalMinutes || 60,
    autoApproveBookings: s.autoApproveBookings === true,
    bookingDurationMinutes: s.bookingDurationMinutes || 60,
    maxDailyBookings: s.maxDailyBookings || 0,

    // SEO
    metaTitle: s.seo?.metaTitle || s.metaTitle,
    metaDescription: s.seo?.metaDescription || s.metaDescription,
    keywords: s.seo?.keywords || s.keywords,

    // Payment gateways
    paymentGateways: s.paymentGateways ? {
      payAtVenue: s.paymentGateways.payAtVenue !== false,
      upiQrCode: s.paymentGateways.upiQrCode === true,
      razorpayEnabled: s.paymentGateways.razorpayEnabled === true,
      stripeEnabled: s.paymentGateways.stripeEnabled === true
    } : {
      payAtVenue: true,
      upiQrCode: true,
      razorpayEnabled: false,
      stripeEnabled: false
    },

    // Appearance
    primaryColor: s.primaryColor,
    logoUrl: s.logoUrl,
    faviconUrl: s.faviconUrl,
    heroBannerUrl: s.heroBannerUrl,
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,

    // Security
    sessionTimeoutMinutes: s.sessionTimeoutMinutes,
    maxLoginAttempts: s.maxLoginAttempts,
    enable2FA: s.enable2FA,

    // Booking & Schedule
    advanceBookingDays: s.advanceBookingDays,
    cancellationNoticeHours: s.cancellationNoticeHours
  };
  return base;
}

// Backend stores roles as 'Super Admin' / 'Admin' / 'Manager' / 'Receptionist';
// the frontend AdminUser type uses lowercase keys. Normalize both directions.
function mapRoleToFrontend(role: string): AdminUser['role'] {
  switch ((role || '').toLowerCase()) {
    case 'super admin':
    case 'super_admin':
      return 'super_admin';
    case 'manager':
      return 'manager';
    case 'receptionist':
      return 'receptionist';
    default:
      return 'admin';
  }
}

function mapRoleToBackend(role: string): string {
  switch ((role || '').toLowerCase()) {
    case 'super_admin':
      return 'Super Admin';
    case 'manager':
      return 'Manager';
    case 'receptionist':
      return 'Receptionist';
    default:
      return 'Admin';
  }
}

function mapAdminUser(u: any): AdminUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: mapRoleToFrontend(u.role),
    status: u.active === false || u.active === 0 ? 'inactive' : 'active',
    avatarUrl: u.avatar_url,
    phone: u.phone || '',
    firstName: u.first_name || '',
    lastName: u.last_name || '',
    username: u.username || '',
    address: u.address || '',
    city: u.city || '',
    state: u.state || '',
    country: u.country || '',
    pincode: u.pincode || '',
    dob: u.dob || '',
    gender: u.gender || '',
    createdAt: u.created_at,
    updatedAt: u.updated_at || undefined,
    lastLogin: u.last_login,
    lastLoginIp: u.lastLoginIp
  };
}

function mapNotificationItem(n: any): NotificationItem {
  return {
    id: n.id,
    type: n.type || 'info',
    title: n.title,
    message: n.message,
    timestamp: n.created_at,
    read: n.is_read === 1 || n.is_read === true,
    linkTab: n.link,
    relatedId: n.link
  };
}

export const api = {
  // Services
  async getServices(): Promise<Service[]> {
    const { data } = await http.get<Service[]>('/services');
    return data.map(mapService);
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const res = await http.post<Service>('/services', data);
    return mapService(res.data);
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const res = await http.put<Service>(`/services/${id}`, data);
    return mapService(res.data);
  },

  async deleteService(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/services/${id}`);
    return res.data;
  },

  // Therapists
  async getTherapists(): Promise<Therapist[]> {
    const { data } = await http.get<Therapist[]>('/therapists');
    return data.map(mapTherapist);
  },

  async createTherapist(data: Partial<Therapist>): Promise<Therapist> {
    const res = await http.post<Therapist>('/therapists', data);
    return mapTherapist(res.data);
  },

  async updateTherapist(id: string, data: Partial<Therapist>): Promise<Therapist> {
    const res = await http.put<Therapist>(`/therapists/${id}`, data);
    return mapTherapist(res.data);
  },

  async deleteTherapist(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/therapists/${id}`);
    return res.data;
  },

  // Availability Slots — backend returns 24h "HH:MM" strings, normalize with correct period.
  async getAvailability(date: string, therapistId?: string): Promise<{ date: string; slots: { time: string; period: string; available: boolean }[] }> {
    const params = { date, therapistId: therapistId || 'any' };
    const { data } = await http.get('/availability', { params });
    const raw: string[] = Array.isArray(data) ? data : [];
    const slots = raw.filter((t) => /^\d{1,2}:\d{2}$/.test(String(t))).map((time) => {
      const hour = Number(String(time).split(':')[0]);
      const period =
        hour < 5 ? 'late-night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';
      return { time, period, available: true };
    });
    return { date, slots };
  },

  // Coupons
  async validateCoupon(code: string, amount: number): Promise<{ valid: boolean; discount: number; coupon: Coupon | null; message?: string }> {
    try {
      const { data } = await http.post('/coupons/validate', { code, amount });
      if (!data || data.valid !== true || !data.coupon) {
        return { valid: false, discount: 0, coupon: null, message: data?.message || 'Invalid coupon' };
      }
      return {
        valid: true,
        discount: data.discountAmount ?? data.discount ?? 0,
        coupon: mapCoupon(data.coupon),
        message: data.message
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Invalid coupon'));
    }
  },

  async getCoupons(): Promise<Coupon[]> {
    const { data } = await http.get<Coupon[]>('/coupons');
    return data.map(mapCoupon);
  },

  async createCoupon(data: Partial<Coupon>): Promise<Coupon> {
    const res = await http.post<Coupon>('/coupons', {
      code: data.code,
      discount: data.discountValue,
      discountType: data.discountType === 'percentage' ? 'percent' : 'fixed',
      minAmount: data.minBookingAmount,
      expiryDate: data.validUntil,
      maxUses: 100
    });
    return mapCoupon(res.data);
  },

  async deleteCoupon(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/coupons/${id}`);
    return res.data;
  },

  // Bookings
  async createBooking(bookingData: any): Promise<Booking> {
    try {
      // Normalize frontend shapes into the backend contract.
      const payload: any = { ...bookingData };
      if (!payload.customerName) {
        payload.customerName = [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim();
      }
      if (payload.additionalNotes !== undefined && payload.notes === undefined) {
        payload.notes = payload.additionalNotes;
      }
      const { data } = await http.post<Booking>('/bookings', payload);
      return mapBooking(data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to submit booking'));
    }
  },

  async getBookings(): Promise<Booking[]> {
    const { data } = await http.get<Booking[]>('/bookings');
    return data.map(mapBooking);
  },

  // Public self-service lookup (no auth required). Ownership is always proven
  // with the booking reference + the email used at booking time.
  async lookupBooking(query: string, email: string): Promise<Booking | null> {
    try {
      const params: Record<string, string> = { q: query, email };
      const { data } = await http.get('/bookings/lookup', { params });
      return mapBooking(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw new Error(getErrorMessage(error, 'Error looking up appointment'));
    }
  },

  // Public self-service cancel/reschedule (bookingNumber + email ownership, no session).
  async publicCancelBooking(bookingNumber: string, email: string, reason?: string): Promise<Booking> {
    const { data } = await http.post('/bookings/public-cancel', { bookingNumber, email, reason });
    return mapBooking(data);
  },

  async publicRescheduleBooking(bookingNumber: string, email: string, date: string, timeSlot: string, therapistId?: string): Promise<Booking> {
    const { data } = await http.post('/bookings/public-reschedule', { bookingNumber, email, date, timeSlot, therapistId });
    return mapBooking(data);
  },

  async updateBooking(id: string, data: Partial<Booking> & { bookingNumber?: string; notes?: string }): Promise<Booking> {
    const payload: any = { ...data };
    if (payload.additionalNotes !== undefined && payload.notes === undefined) {
      payload.notes = payload.additionalNotes;
    }
    const res = await http.put<Booking>(`/bookings/${id}`, payload);
    return mapBooking(res.data);
  },

  async updateBookingStatus(id: string, status: Booking['status'], bookingNumber?: string): Promise<Booking> {
    return this.updateBooking(id, { status, ...(bookingNumber ? { bookingNumber } : {}) });
  },

  async deleteBooking(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/bookings/${id}`);
    return res.data;
  },

  async sendBookingReminder(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await http.post<{ success: boolean; message?: string }>(`/bookings/${id}/send-reminder`);
    return res.data;
  },

  async triggerAllReminders(): Promise<{ success: boolean; count: number; message?: string }> {
    const res = await http.post<{ success: boolean; message?: string; data?: { sentCount?: number } }>('/bookings/trigger-reminders');
    const count = res.data?.data?.sentCount ?? 0;
    return { success: res.data?.success ?? false, count, message: res.data?.message };
  },

  // Contact & Newsletter
  async sendContact(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    consent?: boolean;
    website?: string;
  }) {
    try {
      const res = await http.post('/contact', data);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to send message'));
    }
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const { data } = await http.get<ContactMessage[]>('/contact');
    return data.map(mapContactMessage);
  },

  async subscribeNewsletter(email: string, consent = false, website = '') {
    try {
      const res = await http.post('/newsletter', { email, consent, website });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to subscribe'));
    }
  },

  async unsubscribeNewsletter(email: string, token: string) {
    try {
      const res = await http.post('/newsletter/unsubscribe', { email, token });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to unsubscribe'));
    }
  },

  // Contact & Newsletter extra actions
  async updateContactStatus(id: string, status: string): Promise<ContactMessage> {
    const res = await http.put<ContactMessage>(`/contact/${id}`, { status });
    return mapContactMessage(res.data);
  },

  async replyToContact(id: string, replyText: string): Promise<ContactMessage> {
    try {
      const res = await http.post<ContactMessage>(`/contact/${id}/reply`, { replyText });
      return mapContactMessage(res.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to send reply'));
    }
  },

  async deleteContact(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/contact/${id}`);
    return res.data;
  },

  async bulkDeleteContacts(ids: string[]): Promise<{ success: boolean }> {
    const res = await http.post<{ success: boolean }>('/contact/bulk-delete', { ids });
    return res.data;
  },

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const { data } = await http.get<NewsletterSubscriber[]>('/newsletter');
    return data.map((s: any) => ({
      id: s.id,
      email: s.email,
      subscribedAt: s.subscribed_at,
      active: s.active !== false && s.active !== 0
    }));
  },

  async deleteNewsletterSubscriber(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/newsletter/${id}`);
    return res.data;
  },

  async getEmailLogs(): Promise<EmailLog[]> {
    const { data } = await http.get<EmailLog[]>('/email-logs');
    return data.map((l: any) => ({
      id: l.id,
      to: l.to,
      subject: l.subject,
      type: l.type || 'booking_confirmation',
      sentAt: l.sent_at || l.created_at,
      htmlContent: l.html_content || ''
    }));
  },

  // Testimonials & Blogs
  async getTestimonials(admin = false): Promise<Testimonial[]> {
    const { data } = await http.get<Testimonial[]>('/testimonials', { params: admin ? { all: '1' } : {} });
    return (Array.isArray(data) ? data : []).map(mapTestimonial);
  },

  async getAllTestimonials(): Promise<Testimonial[]> {
    return this.getTestimonials(true);
  },

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await http.put<Testimonial>(`/testimonials/${id}`, data);
    return mapTestimonial(res.data);
  },

  async getBlogs(admin = false): Promise<BlogPost[]> {
    if (admin) {
      const result = await this.getAdminBlogs({ limit: 500 });
      return result.items;
    }
    const result = await this.getPublicBlogs({ limit: 200 });
    return result.items;
  },

  async getAllBlogs(): Promise<BlogPost[]> {
    return (await this.getAdminBlogs({ limit: 500 })).items;
  },

  async getAdminBlogs(params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: string;
    category?: string;
    isFeatured?: boolean;
    sort?: string;
  } = {}): Promise<PaginatedBlogPosts> {
    const { data } = await http.get<any>('/admin/blogs', { params });
    return {
      items: (Array.isArray(data?.items) ? data.items : []).map(mapBlogPost),
      pagination: data?.pagination || {
        page: params.page || 1,
        limit: params.limit || 10,
        total: 0,
        totalPages: 1,
      },
    };
  },

  async getPublicBlogs(params: {
    page?: number;
    limit?: number;
    q?: string;
    category?: string;
    tag?: string;
    isFeatured?: boolean;
    sort?: string;
  } = {}): Promise<PaginatedBlogPosts> {
    const { data } = await http.get<any>('/blog/posts', { params });
    return {
      items: (Array.isArray(data?.items) ? data.items : []).map(mapBlogPost),
      pagination: data?.pagination || {
        page: params.page || 1,
        limit: params.limit || 9,
        total: 0,
        totalPages: 1,
      },
    };
  },

  async getFeaturedBlogs(limit = 6): Promise<BlogPost[]> {
    const { data } = await http.get<any[]>('/blog/featured', { params: { limit } });
    return (Array.isArray(data) ? data : []).map(mapBlogPost);
  },

  async getPublicBlogDetail(slug: string): Promise<BlogPublicDetail | null> {
    try {
      const { data } = await http.get<any>(`/blog/posts/${encodeURIComponent(slug)}`);
      return {
        post: mapBlogPost(data?.post || data),
        related: (Array.isArray(data?.related) ? data.related : []).map(mapBlogPost),
        previous: data?.previous ? mapBlogPost(data.previous) : null,
        next: data?.next ? mapBlogPost(data.next) : null,
        redirectTo: data?.redirectTo || data?.post?.redirectTo || null,
        jsonLd: data?.jsonLd || null,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },

  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    const detail = await this.getPublicBlogDetail(slug);
    return detail?.post || null;
  },

  async getBlogById(id: string): Promise<BlogPost> {
    const { data } = await http.get<any>(`/admin/blogs/${id}`);
    return mapBlogPost(data);
  },

  async createBlog(data: Partial<BlogPost>): Promise<BlogPost> {
    const res = await http.post<any>('/admin/blogs', this.blogPayload(data));
    return mapBlogPost(res.data);
  },

  async updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    const res = await http.put<any>(`/admin/blogs/${id}`, this.blogPayload(data));
    return mapBlogPost(res.data);
  },

  blogPayload(data: Partial<BlogPost>) {
    return {
      title: data.title,
      slug: data.slug || undefined,
      excerpt: data.summary,
      content: data.content,
      category: data.category,
      categoryId: data.categoryId || undefined,
      author: data.author,
      therapistName: data.therapistName,
      therapistAvatarUrl: data.therapistAvatarUrl,
      featuredImageUrl: data.featuredImageUrl !== undefined ? data.featuredImageUrl : data.imageUrl,
      featuredImageAlt: data.featuredImageAlt,
      tags: data.tags,
      status: data.status,
      isFeatured: data.isFeatured ?? data.featureOnHomePage,
      sections: data.sections,
      seo: data.seo,
      expectedUpdatedAt: data.updatedAt,
    };
  },

  async deleteBlog(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/admin/blogs/${id}`);
    return res.data;
  },

  async setBlogStatus(id: string, status: BlogPost['status']): Promise<BlogPost> {
    const res = await http.patch<any>(`/admin/blogs/${id}/status`, { status });
    return mapBlogPost(res.data);
  },

  async setBlogFeatured(id: string, isFeatured: boolean): Promise<BlogPost> {
    const res = await http.patch<any>(`/admin/blogs/${id}/featured`, { isFeatured });
    return mapBlogPost(res.data);
  },

  async toggleBlogPublish(id: string, currentStatus?: BlogPost['status']): Promise<BlogPost> {
    return this.setBlogStatus(id, currentStatus === 'published' ? 'unpublished' : 'published');
  },

  async toggleBlogFeature(id: string, isFeatured?: boolean): Promise<BlogPost> {
    return this.setBlogFeatured(id, !isFeatured);
  },

  async toggleBlogStatus(id: string, currentStatus?: BlogPost['status']): Promise<BlogPost> {
    return this.setBlogStatus(id, currentStatus === 'unpublished' ? 'published' : 'unpublished');
  },

  async getBlogCategories(): Promise<BlogCategory[]> {
    const { data } = await http.get<any[]>('/admin/blogs/categories');
    return (Array.isArray(data) ? data : []).map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      count: category.count || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  },

  async createBlogCategory(data: { name: string; slug?: string; description?: string }): Promise<BlogCategory> {
    const res = await http.post<any>('/admin/blogs/categories', data);
    return { ...res.data, count: res.data?.count || 0 };
  },

  async updateBlogCategory(id: string, data: { name: string; slug?: string; description?: string }): Promise<BlogCategory> {
    const res = await http.put<any>(`/admin/blogs/categories/${id}`, data);
    return { ...res.data, count: res.data?.count || 0 };
  },

  async deleteBlogCategory(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/admin/blogs/categories/${id}`);
    return res.data;
  },

  async getPublicBlogCategories(): Promise<BlogCategory[]> {
    const { data } = await http.get<any[]>('/blog/categories');
    return (Array.isArray(data) ? data : []).map((category) => ({
      id: category.slug || category.name,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      count: category.count || 0,
    }));
  },

  async getPublicBlogTags(): Promise<Array<{ name: string; slug: string; count: number }>> {
    const { data } = await http.get<any[]>('/blog/tags');
    return Array.isArray(data) ? data : [];
  },

  // Gallery
  async getGallery(): Promise<any[]> {
    const { data } = await http.get<any[]>('/gallery');
    return data;
  },

  async createGalleryItem(data: {
    title: string;
    category?: string;
    imageUrl: string;
    subtitle?: string;
    description?: string;
    highlights?: string[];
    dimensions?: string;
    sanitizationLevel?: string;
  }): Promise<any> {
    const res = await http.post<any>('/gallery', data);
    return res.data;
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/gallery/${id}`);
    return res.data;
  },

  // FAQs
  async getFaqs(published?: 'all' | 'true' | 'false'): Promise<any[]> {
    const params = published ? { published } : {};
    const { data } = await http.get<any[]>('/faqs', { params });
    return data;
  },

  async createFaq(data: { question: string; answer: string; category?: string; order?: number; active?: boolean }): Promise<any> {
    const res = await http.post<any>('/faqs', data);
    return res.data;
  },

  async updateFaq(id: string, data: { question?: string; answer?: string; category?: string; order?: number; active?: boolean }): Promise<any> {
    const res = await http.put<any>(`/faqs/${id}`, data);
    return res.data;
  },

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/faqs/${id}`);
    return res.data;
  },

  async toggleFaqStatus(id: string): Promise<any> {
    const res = await http.patch<any>(`/faqs/${id}/toggle`);
    return res.data;
  },

  // Testimonials
  async createTestimonial(data: { name: string; comment: string; rating?: number; role?: string; avatarUrl?: string }): Promise<Testimonial> {
    const res = await http.post<Testimonial>('/testimonials', data);
    return mapTestimonial(res.data);
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/testimonials/${id}`);
    return res.data;
  },

  // Business Settings (public safe subset; full view for admins)
  async getSettings(): Promise<BusinessSettings> {
    const { data } = await http.get<BusinessSettings>('/settings');
    return mapBusinessSettings(data);
  },

  async getFullSettings(): Promise<BusinessSettings> {
    // Never fall back to the public settings payload here: it intentionally
    // omits SMTP credentials and templates, and saving that fallback would
    // erase the real values.
    const { data } = await http.get<BusinessSettings>('/settings/full');
    return mapBusinessSettings(data);
  },

  async updateSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const res = await http.put<BusinessSettings>('/settings', data);
    return mapBusinessSettings(res.data);
  },

  // Admin Stats & Audit Logs
  async getAdminStats() {
    const { data } = await http.get('/admin/stats');
    return data;
  },

  async getAuditLogs(): Promise<SystemAuditLog[]> {
    const { data } = await http.get<SystemAuditLog[]>('/admin/audit-logs');
    return data.map((l: any) => ({
      id: l.id,
      action: l.action,
      user: l.user || l.user_name,
      details: l.details || l.description,
      timestamp: l.timestamp || l.created_at,
      ipAddress: l.ip_address
    }));
  },

  async getLoginActivities(): Promise<LoginActivity[]> {
    const { data } = await http.get<LoginActivity[]>('/admin/login-activities');
    return data.map((l: any) => ({
      id: l.id,
      userId: l.user_id || l.userId,
      userName: l.user_name || l.userName || '',
      userEmail: l.user_email || l.email || '',
      timestamp: l.timestamp || l.created_at,
      ipAddress: l.ip_address,
      status: l.status,
      deviceInfo: l.device_info || l.user_agent
    }));
  },

  // Admin Auth Methods
  async adminLogin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    try {
      const { data } = await http.post('/admin/login', { email, password });
      return { token: data.token, user: mapAdminUser(data.user) };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Invalid credentials'));
    }
  },

  async getCurrentUser(): Promise<AdminUser> {
    const { data } = await http.get<AdminUser>('/admin/me');
    return mapAdminUser(data);
  },

  async adminSignup(data: {
    name: string;
    email: string;
    password: string;
    requestedRole?: string;
    consent?: boolean;
    website?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await http.post<{ success: boolean; message: string }>('/admin/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        requestedRole: data.requestedRole || 'Receptionist',
        consent: data.consent,
        website: data.website,
      });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to submit application'));
    }
  },

  // Staff applications (Super Admin review queue)
  async getStaffApplications(): Promise<StaffApplication[]> {
    const { data } = await http.get<StaffApplication[]>('/admin/applications');
    return Array.isArray(data) ? data : [];
  },

  async approveStaffApplication(id: string): Promise<StaffApplication> {
    const res = await http.post<StaffApplication>(`/admin/applications/${id}/approve`);
    return res.data;
  },

  async rejectStaffApplication(id: string, reason?: string): Promise<StaffApplication> {
    const res = await http.post<StaffApplication>(`/admin/applications/${id}/reject`, { reason });
    return res.data;
  },

  async deleteStaffApplication(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/admin/applications/${id}`);
    return res.data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await http.post<{ success: boolean; message: string }>('/admin/forgot-password', { email });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to request password reset'));
    }
  },

  // Backend expects a signed reset token (from the email link), not the email address.
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await http.post<{ success: boolean; message: string }>('/admin/reset-password', { token, newPassword });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to reset password'));
    }
  },

  // Backend resolves the user from the JWT — no userId needed.
  async changePassword(currentPassword: string, newPassword: string, confirmNewPassword?: string): Promise<{ success: boolean; message: string; requireRelogin?: boolean }> {
    try {
      const res = await http.post<{ success: boolean; message: string; requireRelogin?: boolean }>('/admin/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmNewPassword || newPassword,
      });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to change password'));
    }
  },

  // Self-service profile (all staff roles)
  async updateProfile(
    data: Partial<AdminUser> & { currentPassword?: string }
  ): Promise<AdminUser & { requireRelogin?: boolean }> {
    const res = await http.put<AdminUser & { requireRelogin?: boolean }>('/admin/profile', {
      name: data.name,
      firstName: (data as any).firstName,
      lastName: (data as any).lastName,
      username: (data as any).username,
      phone: data.phone,
      address: (data as any).address,
      city: (data as any).city,
      state: (data as any).state,
      country: (data as any).country,
      pincode: (data as any).pincode,
      dob: (data as any).dob,
      gender: (data as any).gender,
      email: data.email,
      currentPassword: data.currentPassword,
    });
    // Changing the login identity revokes existing sessions server-side.
    return {
      ...mapAdminUser(res.data),
      requireRelogin: res.data?.requireRelogin === true,
    };
  },

  async uploadAvatar(file: File): Promise<AdminUser> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await http.post<AdminUser>('/admin/profile-picture', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapAdminUser(res.data);
  },

  async removeAvatar(): Promise<AdminUser> {
    const res = await http.delete<AdminUser>('/admin/profile-picture');
    return mapAdminUser(res.data);
  },

  // Avatar from a remote https image URL (all roles — backend validates).
  async setAvatarUrl(avatarUrl: string): Promise<AdminUser> {
    const value = String(avatarUrl || '').trim();
    if (!/^https:\/\//i.test(value)) throw new Error('Image URL must start with https://');
    if (!/\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(value.split('?')[0])) {
      throw new Error('Image URL must end in .jpg, .png, .webp or .gif');
    }
    try {
      const res = await http.put<AdminUser>('/admin/profile-picture/url', { avatarUrl: value });
      return mapAdminUser(res.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not set profile picture from URL'));
    }
  },

  // Admin User Management
  async getAdminUsers(): Promise<AdminUser[]> {
    const { data } = await http.get<AdminUser[]>('/admin/users');
    return data.map(mapAdminUser);
  },

  async createAdminUser(data: Partial<AdminUser> & { password?: string }): Promise<AdminUser> {
    const res = await http.post<AdminUser>('/admin/users', {
      name: data.name,
      email: data.email,
      password: data.password,
      role: mapRoleToBackend(data.role as string),
      phone: (data as any).phone
    });
    return mapAdminUser(res.data);
  },

  async updateAdminUser(
    id: string,
    data: Partial<AdminUser> & { password?: string; currentPassword?: string }
  ): Promise<AdminUser> {
    const active =
      data.status === undefined ? undefined : data.status === 'active';
    const res = await http.put<AdminUser>(`/admin/users/${id}`, {
      name: data.name,
      email: data.email,
      role: data.role ? mapRoleToBackend(data.role as string) : undefined,
      phone: (data as any).phone,
      // Identity/state changes are honored by the backend now.
      active,
      password: data.password || undefined,
      currentPassword: data.currentPassword || undefined
    });
    return mapAdminUser(res.data);
  },

  async deleteAdminUser(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/admin/users/${id}`);
    return res.data;
  },

  // Notifications — backend returns { notifications, unreadCount }
  async getNotifications(): Promise<NotificationItem[]> {
    const { data } = await http.get<{ notifications: any[]; unreadCount: number }>('/admin/notifications');
    return (data?.notifications || []).map(mapNotificationItem);
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await http.put<{ success: boolean }>(`/admin/notifications/${id}/read`);
    return res.data;
  },

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    const res = await http.post<{ success: boolean }>('/admin/notifications/mark-all-read');
    return res.data;
  },

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/admin/notifications/${id}`);
    return res.data;
  },

  // Schedule & Calendar Config
  async getScheduleConfig(): Promise<ScheduleConfig> {
    const { data } = await http.get<ScheduleConfig>('/admin/schedule');
    return data;
  },

  async updateScheduleConfig(data: Partial<ScheduleConfig>): Promise<ScheduleConfig> {
    const res = await http.put<ScheduleConfig>('/admin/schedule', data);
    return res.data;
  },

  // Export Reports (auth required — download via authenticated fetch + blob)
  async downloadExportReport(type: 'bookings' | 'contacts' | 'therapists' | 'services' | 'subscribers'): Promise<void> {
    const res = await http.get(`/admin/reports/export?type=${type}`, { responseType: 'blob' });
    const blobUrl = URL.createObjectURL(res.data as Blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `tripod_wellness_${type}_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  },

  getExportReportUrl(): string {
    throw new Error('Use downloadExportReport() — direct links lack auth and will return 401');
  },

  // AI Spa Assistant (legacy non-streaming endpoint — kept as fallback)
  async sendAiChat(message: string, history?: { sender: 'user' | 'assistant'; text: string }[]): Promise<{ reply: string }> {
    try {
      const { data } = await http.post('/ai/chat', { message, history });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'AI assistant unavailable'));
    }
  },

  // RAG chat over SSE. Streams `token` events, resolves on `done`.
  // Uses fetch (not axios) so tokens render progressively + abort works.
  sendChatStream(
    args: {
      message: string;
      conversationId?: string;
      history?: { sender: 'user' | 'assistant'; text: string }[];
      signal?: AbortSignal;
      onToken: (text: string) => void;
    }
  ): Promise<{ conversationId: string; answer: string; sources: { title: string; url: string }[]; confidence: number; grounded: boolean }> {
    const base = String(API_BASE || '/api').replace(/\/$/, '');
    const token = localStorage.getItem(TOKEN_KEY);
    const IDLE_TIMEOUT_MS = 60_000;

    return new Promise((resolvePromise, rejectPromise) => {
      let settled = false;
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
      let idleTimer: ReturnType<typeof setTimeout> | undefined;

      const cleanup = () => {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = undefined;
        args.signal?.removeEventListener('abort', onAbort);
        if (reader) {
          try {
            void reader.cancel();
          } catch {
            /* already closed */
          }
          reader = null;
        }
      };

      const finish = (
        fn: (value: any) => void,
        value: unknown
      ) => {
        if (settled) return;
        settled = true;
        cleanup();
        fn(value);
      };

      const fail = (err: unknown) =>
        finish(rejectPromise, err instanceof Error ? err : new Error('AI assistant unavailable'));

      const succeed = (value: {
        conversationId: string;
        answer: string;
        sources: { title: string; url: string }[];
        confidence: number;
        grounded: boolean;
      }) => finish(resolvePromise, value);

      const onAbort = () => fail(new DOMException('Aborted', 'AbortError'));

      const resetIdleTimer = () => {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => fail(new Error('The assistant stopped responding. Please try again.')), IDLE_TIMEOUT_MS);
      };

      if (args.signal?.aborted) {
        onAbort();
        return;
      }
      args.signal?.addEventListener('abort', onAbort, { once: true });
      resetIdleTimer();

      fetch(`${base}/ai/rag/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          conversationId: args.conversationId,
          message: args.message,
          history: args.history,
        }),
        signal: args.signal,
        credentials: 'include',
      })
        .then(async (resp) => {
          if (!resp.ok || !resp.body) {
            let detail = 'AI assistant unavailable';
            try {
              const data = await resp.json();
              detail = (data as { error?: string; message?: string }).error || (data as { message?: string }).message || detail;
            } catch {
              try {
                const text = await resp.text();
                if (text.trim()) detail = text.trim().slice(0, 300);
              } catch {
                /* keep default */
              }
            }
            fail(new Error(resp.status === 429 ? 'Too many messages — please wait a little.' : detail));
            return;
          }

          reader = resp.body.getReader();
          const decoder = new TextDecoder();
          let buf = '';
          let eventName = '';
          let dataLines: string[] = [];

          const dispatch = () => {
            const name = eventName || 'message';
            const raw = dataLines.join('\n');
            eventName = '';
            dataLines = [];
            if (!raw.trim()) return;

            let data: any;
            try {
              data = JSON.parse(raw);
            } catch {
              // A malformed frame should not kill the whole stream; the server
              // always sends one JSON object per event.
              return;
            }

            if (name === 'token' && typeof data.text === 'string') {
              args.onToken(data.text);
            } else if (name === 'done') {
              succeed({
                conversationId: String(data.conversationId || ''),
                answer: String(data.answer || ''),
                sources: Array.isArray(data.sources) ? data.sources : [],
                confidence: Number(data.confidence ?? 0),
                grounded: data.grounded !== false,
              });
            } else if (name === 'error') {
              fail(new Error(String(data.message || 'AI assistant unavailable')));
            }
          };

          const processLine = (line: string) => {
            // Comments / heartbeats start with a colon.
            if (line.startsWith(':')) return;
            if (line === '') {
              dispatch();
              return;
            }
            const idx = line.indexOf(':');
            const field = idx === -1 ? line : line.slice(0, idx);
            let value = idx === -1 ? '' : line.slice(idx + 1);
            if (value.startsWith(' ')) value = value.slice(1);
            if (field === 'event') eventName = value;
            else if (field === 'data') dataLines.push(value);
            // `id` / `retry` fields are irrelevant to this stream.
          };

          const pump = async () => {
            try {
              for (;;) {
                if (settled) return;
                const { done, value } = await reader!.read();
                if (done) {
                  buf += decoder.decode();
                  if (buf) {
                    for (const line of buf.split(/\r?\n/)) processLine(line);
                  }
                  dispatch();
                  if (!settled) fail(new Error('The assistant connection closed before finishing.'));
                  return;
                }
                resetIdleTimer();
                buf += decoder.decode(value, { stream: true });
                let newline = buf.search(/\r?\n/);
                while (!settled && newline !== -1) {
                  const line = buf.slice(0, newline);
                  const match = buf.slice(newline).match(/^\r?\n/);
                  buf = buf.slice(newline + (match ? match[0].length : 1));
                  processLine(line);
                  if (settled) return;
                  newline = buf.search(/\r?\n/);
                }
              }
            } catch (err) {
              if (settled) return;
              if (err instanceof Error && err.name === 'AbortError') onAbort();
              else fail(err);
            }
          };

          void pump();
        })
        .catch((err: unknown) => {
          if (settled) return;
          if (err instanceof Error && err.name === 'AbortError') onAbort();
          else fail(err);
        });
    });
  },

  async getChatHistory(conversationId: string): Promise<{ conversationId: string; messages: { role: string; text: string }[] }> {
    const { data } = await http.get(`/ai/rag/history/${encodeURIComponent(conversationId)}`);
    return data;
  },

  async clearChatHistory(conversationId: string): Promise<{ success: boolean }> {
    const { data } = await http.delete(`/ai/rag/history/${encodeURIComponent(conversationId)}`);
    return data;
  },

  // Admin RAG console
  async getRagSources(): Promise<{ sources: { source: string; chunks: number; updatedAt: string | null; status: string }[] }> {
    const { data } = await http.get('/admin/rag/sources');
    return data;
  },

  async reindexRag(source?: string): Promise<{ success: boolean; result: unknown }> {
    const { data } = await http.post('/admin/rag/reindex', source ? { source } : {});
    return data;
  },

  async deleteRagSource(source: string): Promise<{ success: boolean; deleted: number }> {
    const { data } = await http.delete(`/admin/rag/sources/${encodeURIComponent(source)}`);
    return data;
  },

  async testRagRetrieval(query: string): Promise<{ query: string; usedVector: boolean; threshold: number; chunks: { title: string; source: string; category: string; url: string; score: number; excerpt: string }[] }> {
    const { data } = await http.post('/admin/rag/test', { query });
    return data;
  },

  async getRagReview(limit = 50): Promise<{ items: { id: string; conversationId: string; question: string; answer: string; confidence: number; createdAt: string }[] }> {
    const { data } = await http.get('/admin/rag/review', { params: { limit } });
    return data;
  },

  async getRagUsage(): Promise<{ answers7d: number; lowConfidence7d: number; tokens7d: number; avgLatencyMs: number; model: string; embeddingModel: string; topK: number; threshold: number }> {
    const { data } = await http.get('/admin/rag/usage');
    return data;
  },

  // File upload (admin-only endpoint)
  async uploadFile(file: File): Promise<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> {
    const okTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!okTypes.includes(file.type)) throw new Error('Only JPEG, PNG, WebP or GIF images are allowed');
    if (file.size > 5 * 1024 * 1024) throw new Error('Image must be under 5MB');
    const formData = new FormData();
    formData.append('file', file);
    const res = await http.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

// Named exports kept for pages that import them directly (BookingPage, ServiceDetailPage, AdminLoginPage).
export const getServices = () => api.getServices();
export const getTherapists = () => api.getTherapists();
export const getSettings = () => api.getSettings();
export const createBooking = (data: any) => api.createBooking(data);
export const adminLogin = (email: string, password: string) => api.adminLogin(email, password);
export const adminSignup = (data: {
  name: string;
  email: string;
  password: string;
  requestedRole?: string;
  consent?: boolean;
  website?: string;
}) => api.adminSignup(data);
export default api;
