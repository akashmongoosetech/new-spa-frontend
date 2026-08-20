import axios from 'axios';
import {
  Service,
  Therapist,
  Booking,
  Coupon,
  Testimonial,
  BlogPost,
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

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'aura_admin_token';
const USER_KEY = 'aura_admin_user';

const http = axios.create({ baseURL: API_BASE, withCredentials: true });

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
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
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
    active: s.active !== false,
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
    active: t.active !== false
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

function mapBlogPost(b: any): BlogPost {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    category: b.category,
    author: b.author,
    date: b.date || b.created_at,
    readTime: b.read_time || `${Math.max(1, Math.ceil((b.content || '').split(' ').length / 200))} min read`,
    summary: b.excerpt || b.summary,
    content: b.content,
    imageUrl: b.image_url || b.cover_image,
    tags: b.tags || [],
    published: b.published !== false && b.published !== 0
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

function mapBusinessSettings(s: any): BusinessSettings {
  const base: BusinessSettings = {
    businessName: s.businessName || s.siteName || 'Aura Luxe Spa & Wellness',
    tagline: s.tagline || 'Premier Indian Massage Therapy & Holistic Wellness Sanctuary',
    phone: s.phone || '+91 98200 12345',
    whatsapp: s.whatsapp || s.phone || '+91 98200 12345',
    email: s.email || 'concierge@auraluxespa.in',
    address: s.address || 'Indore, Ujjain, Dewas',
    city: s.city || 'Indore, Ujjain, Dewas',
    workingHours: s.workingHours || s.openingHours || 'Mon - Sun: 09:00 AM - 10:00 PM IST',
    currencySymbol: s.currencySymbol || '₹',
    currencyCode: s.currencyCode || 'INR',
    googleMapsUrl: s.googleMapsUrl || 'https://maps.google.com/?q=Bandra+West+Mumbai',
    facebookUrl: s.facebookUrl || 'https://facebook.com/auraluxespa',
    instagramUrl: s.instagramUrl || 'https://instagram.com/auraluxespa',
    twitterUrl: s.twitterUrl || 'https://twitter.com/auraluxespa',
    smtpConfigured: s.smtpConfigured !== false,
    maxBookingsPerSlot: s.maxBookingsPerSlot || 3,
    slotIntervalMinutes: s.slotIntervalMinutes || 60,
    autoApproveBookings: s.autoApproveBookings !== false,

    // SEO
    metaTitle: s.seo?.metaTitle || s.metaTitle,
    metaDescription: s.seo?.metaDescription || s.metaDescription,
    keywords: s.seo?.keywords || s.keywords,

    // Payment gateways
    paymentGateways: s.paymentGateways ? {
      payAtVenue: s.paymentGateways.payAtVenue !== false,
      upiQrCode: s.paymentGateways.upiQrCode !== false,
      razorpayEnabled: s.paymentGateways.razorpayEnabled !== false,
      stripeEnabled: s.paymentGateways.stripeEnabled !== false
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
    createdAt: u.created_at,
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

  // Availability Slots — backend returns a plain string array, normalize it.
  async getAvailability(date: string, therapistId?: string): Promise<{ date: string; slots: { time: string; period: string; available: boolean }[] }> {
    const params = { date, therapistId: therapistId || 'any' };
    const { data } = await http.get('/availability', { params });
    const raw: string[] = Array.isArray(data) ? data : [];
    const slots = raw.map((time) => {
      const hour = parseInt(time, 10);
      const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';
      return { time, period, available: true };
    });
    return { date, slots };
  },

  // Coupons
  async validateCoupon(code: string, amount: number): Promise<{ valid: boolean; discount: number; coupon: Coupon }> {
    try {
      const { data } = await http.post('/coupons/validate', { code, amount });
      return {
        valid: data.valid,
        discount: data.discountAmount ?? data.discount ?? 0,
        coupon: mapCoupon(data.coupon)
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

  // Public self-service lookup (no auth required).
  async lookupBooking(query: string): Promise<Booking | null> {
    try {
      const { data } = await http.get('/bookings/lookup', { params: { q: query } });
      return mapBooking(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw new Error(getErrorMessage(error, 'Error looking up appointment'));
    }
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
  async sendContact(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
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

  async subscribeNewsletter(email: string) {
    try {
      const res = await http.post('/newsletter', { email });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to subscribe'));
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
  async getTestimonials(): Promise<Testimonial[]> {
    const { data } = await http.get<Testimonial[]>('/testimonials');
    return data.map(mapTestimonial);
  },

  async getBlogs(): Promise<BlogPost[]> {
    const { data } = await http.get<BlogPost[]>('/blogs');
    return data.map(mapBlogPost);
  },

  async createBlog(data: Partial<BlogPost>): Promise<BlogPost> {
    const res = await http.post<BlogPost>('/blogs', {
      title: data.title,
      excerpt: data.summary,
      content: data.content,
      category: data.category,
      author: data.author,
      imageUrl: data.imageUrl,
      tags: data.tags
    });
    return mapBlogPost(res.data);
  },

  async updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    const res = await http.put<BlogPost>(`/blogs/${id}`, {
      title: data.title,
      excerpt: data.summary,
      content: data.content,
      category: data.category,
      author: data.author,
      imageUrl: data.imageUrl,
      tags: data.tags
    });
    return mapBlogPost(res.data);
  },

  async deleteBlog(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/blogs/${id}`);
    return res.data;
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
  async getFaqs(): Promise<any[]> {
    const { data } = await http.get<any[]>('/faqs');
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

  // Testimonials
  async createTestimonial(data: { name: string; comment: string; rating?: number; role?: string; avatarUrl?: string }): Promise<Testimonial> {
    const res = await http.post<Testimonial>('/testimonials', data);
    return mapTestimonial(res.data);
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    const res = await http.delete<{ success: boolean }>(`/testimonials/${id}`);
    return res.data;
  },

  // Business Settings
  async getSettings(): Promise<BusinessSettings> {
    const { data } = await http.get<BusinessSettings>('/settings');
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

  async adminSignup(data: { name: string; email: string; password: string; requestedRole?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await http.post<{ success: boolean; message: string }>('/admin/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        requestedRole: data.requestedRole || 'Receptionist',
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
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await http.post<{ success: boolean; message: string }>('/admin/change-password', { currentPassword, newPassword });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to change password'));
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

  async updateAdminUser(id: string, data: Partial<AdminUser> & { password?: string }): Promise<AdminUser> {
    const res = await http.put<AdminUser>(`/admin/users/${id}`, {
      name: data.name,
      email: data.email,
      role: data.role ? mapRoleToBackend(data.role as string) : undefined,
      password: data.password || undefined,
      phone: (data as any).phone
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
    a.download = `aura_luxe_${type}_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  },

  getExportReportUrl(type: 'bookings' | 'contacts' | 'therapists' | 'services' | 'subscribers'): string {
    return `${API_BASE}/admin/reports/export?type=${type}`;
  },

  // AI Spa Assistant
  async sendAiChat(message: string, history?: { sender: 'user' | 'assistant'; text: string }[]): Promise<{ reply: string }> {
    try {
      const { data } = await http.post('/ai/chat', { message, history });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'AI assistant unavailable'));
    }
  },

  // File upload (admin-only endpoint)
  async uploadFile(file: File): Promise<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> {
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
export const adminSignup = (data: { name: string; email: string; password: string; requestedRole?: string }) => api.adminSignup(data);
export default api;
