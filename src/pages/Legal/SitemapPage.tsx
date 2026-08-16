import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/ui/SEO';
import { Map, Compass, Shield, Users, Sparkles } from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const links = [
    { label: 'Home Sanctuary', path: '/' },
    { label: 'Therapies & Menu', path: '/services' },
    { label: 'About Aura Luxe', path: '/about' },
    { label: 'Certified Therapists', path: '/therapists' },
    { label: 'Sanctuary Gallery', path: '/gallery' },
    { label: 'Wellness Journal', path: '/blog' },
    { label: 'Book Appointment', path: '/booking' },
    { label: 'Contact Concierge', path: '/contact' },
    { label: 'Frequently Asked Questions', path: '/faq' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-and-conditions' },
    { label: 'Refund Policy', path: '/refund-policy' },
    { label: 'Cookie Policy', path: '/cookie-policy' },
    { label: 'Admin Portal', path: '/admin-login' },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans min-h-screen">
      <SEO title="Sitemap | Aura Luxe Spa" description="Navigate all pages and services on Aura Luxe Spa." />
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Compass className="w-8 h-8 text-[#2CB5A0]" />
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Sanctuary Sitemap</h1>
            <p className="text-xs text-gray-500 font-light mt-1">Complete directory of all pages & portal paths</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className="p-4 rounded-xl border border-gray-100 hover:border-[#2CB5A0] hover:bg-[#2CB5A0]/5 transition-all flex items-center justify-between text-sm font-medium text-gray-800 hover:text-[#2CB5A0]"
            >
              <span>{link.label}</span>
              <span className="text-xs text-gray-400 font-mono">{link.path}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
