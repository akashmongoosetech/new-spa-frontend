import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const HomePage = lazy(() => import('../pages/Home/HomePage'));
const AboutPage = lazy(() => import('../pages/About/AboutPage'));
const ServicesPage = lazy(() => import('../pages/Services/ServicesPage'));
const ServiceDetailPage = lazy(() => import('../pages/Services/ServiceDetailPage'));
const GalleryPage = lazy(() => import('../pages/Gallery/GalleryPage'));
const TherapistsPage = lazy(() => import('../pages/Therapists/TherapistsPage'));
const TherapistDetailPage = lazy(() => import('../pages/Therapists/TherapistDetailPage'));
const BookingPage = lazy(() => import('../pages/Booking/BookingPage'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));
const BlogPage = lazy(() => import('../pages/Blog/BlogPage'));
const BlogDetailPage = lazy(() => import('../pages/Blog/BlogDetailPage'));
const FAQPage = lazy(() => import('../pages/FAQ/FAQPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/Legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('../pages/Legal/TermsPage'));
const RefundPolicyPage = lazy(() => import('../pages/Legal/RefundPolicyPage'));
const CookiePolicyPage = lazy(() => import('../pages/Legal/CookiePolicyPage'));
const SitemapPage = lazy(() => import('../pages/Legal/SitemapPage'));

export const renderPublicRoutes = () => (
  <Route
    element={
      <Suspense fallback={<LoadingSpinner fullScreen label="Loading sanctuary..." />}>
        <MainLayout />
      </Suspense>
    }
  >
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="services" element={<ServicesPage />} />
    <Route path="services/:slug" element={<ServiceDetailPage />} />
    <Route path="gallery" element={<GalleryPage />} />
    <Route path="therapists" element={<TherapistsPage />} />
    <Route path="therapists/:slug" element={<TherapistDetailPage />} />
    <Route path="booking" element={<BookingPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="blog" element={<BlogPage />} />
    <Route path="blog/:slug" element={<BlogDetailPage />} />
    <Route path="faq" element={<FAQPage />} />
    <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="terms-and-conditions" element={<TermsPage />} />
    <Route path="refund-policy" element={<RefundPolicyPage />} />
    <Route path="cookie-policy" element={<CookiePolicyPage />} />
    <Route path="sitemap" element={<SitemapPage />} />
  </Route>
);

export default renderPublicRoutes;
