import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, Star, Sparkles, Filter, Info } from 'lucide-react';
import { Service, BusinessSettings } from '../types';
import { Modal } from '../components/ui/Modal';
import { SEO } from '../components/ui/SEO';

interface ServicesPageProps {
  services: Service[];
  settings: BusinessSettings;
  onOpenBooking: (serviceId?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  settings,
  onOpenBooking,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<Service | null>(null);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'ayurvedic', label: 'Ayurvedic & Kerala Therapies' },
    { id: 'relaxation', label: 'Swedish & Relaxation' },
    { id: 'deep_tissue', label: 'Deep Tissue & Sports' },
    { id: 'specialized', label: 'Hot Stone & Specialized' },
    { id: 'vip_packages', label: 'VIP Executive Packages' },
  ];

  const safeServices = services || [];
  const filteredServices =
    activeCategory === 'all'
      ? safeServices
      : safeServices.filter((s) => s?.category === activeCategory);

  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen">
      <SEO
        title="Massage Therapies & Pricing | Aura Luxe Spa"
        description="Explore our complete menu of Men-to-Men massage therapies including Swedish, Deep Tissue, Hot Stone, and Executive VIP packages."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Curated Menu
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-gray-900">
            Professional Men's Therapy Menu
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Every session is tailored to your body's physical demands. Select from individual therapies or comprehensive VIP executive packages.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`service-cat-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#2CB5A0] text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={srv.imageUrl}
                    alt={srv.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                    {settings.currencySymbol || '₹'}{srv.price}
                  </div>
                  {srv.originalPrice && (
                    <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-[11px] font-bold">
                      Save {settings.currencySymbol || '₹'}{srv.originalPrice - srv.price}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2CB5A0]" />
                      {srv.durationMinutes} Minutes
                    </span>
                    <span className="text-amber-500 font-bold">★ {srv.rating} ({srv.reviewsCount})</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {srv.shortDescription}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Includes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(srv.includedItems || []).slice(0, 3).map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-teal-50 text-[10px] font-medium text-[#2CB5A0]">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <button
                  id={`view-details-${srv.id}`}
                  onClick={() => setSelectedServiceDetail(srv)}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>View Therapy Details & FAQs</span>
                </button>

                <button
                  id={`book-service-${srv.id}`}
                  onClick={() => onOpenBooking(srv.id)}
                  className="w-full py-3 rounded-xl bg-[#2CB5A0] hover:bg-[#259b89] text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve This Therapy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <Modal
        isOpen={!!selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
        title={selectedServiceDetail?.title}
        maxWidth="2xl"
      >
        {selectedServiceDetail && (
          <div className="space-y-6 font-sans">
            <img
              src={selectedServiceDetail.imageUrl}
              alt={selectedServiceDetail.title}
              className="w-full h-64 object-cover rounded-2xl"
            />

            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-2xl font-serif font-bold text-[#2CB5A0] font-mono">
                {settings.currencySymbol || '₹'}{selectedServiceDetail.price}{' '}
                <span className="text-xs text-gray-400 font-sans font-normal">
                  ({selectedServiceDetail.durationMinutes} Minutes)
                </span>
              </span>
              <span className="text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                ★ {selectedServiceDetail.rating} Rating
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Therapy Description
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {selectedServiceDetail.fullDescription}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Therapeutic Benefits
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                {(selectedServiceDetail.benefits || []).map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2CB5A0] shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedServiceDetail.faq && selectedServiceDetail.faq.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Specific Therapy FAQs
                </h4>
                {selectedServiceDetail.faq.map((fq, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-gray-900">Q: {fq.question}</p>
                    <p className="text-xs text-gray-600">A: {fq.answer}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => {
                  const srvId = selectedServiceDetail.id;
                  setSelectedServiceDetail(null);
                  onOpenBooking(srvId);
                }}
                className="px-6 py-3 rounded-xl bg-[#2CB5A0] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Now ({settings.currencySymbol || '₹'}{selectedServiceDetail.price})</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
