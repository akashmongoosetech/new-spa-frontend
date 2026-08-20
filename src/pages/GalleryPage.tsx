import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  Award,
  Clock,
  MapPin,
  Tag
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { BusinessSettings } from '../types';

interface GalleryPageProps {
  settings?: BusinessSettings;
  photos?: GalleryPhoto[];
  onOpenBooking?: (serviceId?: string) => void;
  setActiveTab?: (tab: string) => void;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  subtitle: string;
  category: 'suites' | 'equipment' | 'ambiance' | 'hydrotherapy';
  categoryLabel: string;
  url: string;
  description: string;
  highlights: string[];
  dimensions: string;
  sanitizationLevel: string;
}

const GALLERY_DATA: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'The Sovereign VIP Therapy Suite',
    subtitle: 'Private Master Suite with Ensuite Shower',
    category: 'suites',
    categoryLabel: 'VIP Suites',
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1400&auto=format&fit=crop',
    description: 'Our flagship private therapy room equipped with dual hydraulic thermal beds, adjustable chromotherapy lighting, and soundproof acoustic walls designed for absolute privacy.',
    highlights: ['350 sq. ft. Private Space', 'Soundproof Acoustic Insulation', 'Ensuite Rainfall Shower', 'Dual Heated Massage Beds'],
    dimensions: '350 sq ft Suite',
    sanitizationLevel: 'Hospital-Grade UV-C Disinfected',
  },
  {
    id: 'photo-2',
    title: 'Volcanic Hot Stone Therapy Station',
    subtitle: 'Professional Basalt & Jade Warmers',
    category: 'equipment',
    categoryLabel: 'Professional Equipment',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1400&auto=format&fit=crop',
    description: 'Precision digital hot stone warming units housing authentic volcanic basalt stones harvested from Iceland, maintained at an optimal 54°C for deep muscle relaxation.',
    highlights: ['Icelandic Basalt Stones', 'Digital Temperature Control', 'Infrared Sanitization', 'Aromatherapy Oil Diffusers'],
    dimensions: 'Dedicated Prep Suite',
    sanitizationLevel: 'Sterilized After Each Session',
  },
  {
    id: 'photo-3',
    title: 'Hydrotherapy Jacuzzi & Vitality Bath',
    subtitle: 'Eucalyptus Mineral Immersion',
    category: 'hydrotherapy',
    categoryLabel: 'Hydrotherapy & Steam',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1400&auto=format&fit=crop',
    description: 'Custom jacuzzi spa tub with 48 hydro-jets configured for post-massage circulation improvement, infused with magnesium flakes and pure eucalyptus essential oils.',
    highlights: ['48 Target Jet Massage', 'Magnesium Mineral Salts', 'Chromotherapy Underwater Lights', 'Private Sunken Tub'],
    dimensions: 'Hydro Pool Lounge',
    sanitizationLevel: 'Ozone Auto-Purified Water',
  },
  {
    id: 'photo-4',
    title: 'Organic Botanical Essential Oil Bar',
    subtitle: '100% Pure Therapeutic Grade Extracts',
    category: 'equipment',
    categoryLabel: 'Professional Equipment',
    url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1400&auto=format&fit=crop',
    description: 'Cold-pressed organic carrier oils including Jojoba, Sweet Almond, and Argan, custom blended by your therapist with wild lavender, sandalwood, and bergamot.',
    highlights: ['100% Cold-Pressed Organic', 'Custom Blending Bar', 'Hypoallergenic Formulations', 'Therapeutic Grade Extracts'],
    dimensions: 'Apothecary Corner',
    sanitizationLevel: 'Glass Vial Sealed Storage',
  },
  {
    id: 'photo-5',
    title: 'Deep Tissue Muscle Recovery Suite',
    subtitle: 'Ergonomic Percussive & Stretching Suite',
    category: 'suites',
    categoryLabel: 'VIP Suites',
    url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1400&auto=format&fit=crop',
    description: 'Tailored for gentlemen seeking sports rehabilitation and deep knot release. Features high-density bolster cushions, stretch straps, and Theragun PRO percussive tools.',
    highlights: ['Theragun PRO Included', 'High-Density Bolsters', 'Sports Recovery Bench', 'Zero-Gravity Recliners'],
    dimensions: 'Suite 3 • 280 sq ft',
    sanitizationLevel: 'Medical Grade Cleaned',
  },
  {
    id: 'photo-6',
    title: 'Executive Relaxation & Tea Lounge',
    subtitle: 'Post-Treatment Hydration Sanctuary',
    category: 'ambiance',
    categoryLabel: 'Ambiance & Lounge',
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1400&auto=format&fit=crop',
    description: 'Tranquil sanctuary designed for post-massage decompression. Complimentary organic herbal infusions, alkaline hydration water, and ambient soundscapes.',
    highlights: ['Complimentary Herbal Tea', 'Zero-Gravity Seating', 'Ambient Soundscapes', 'Fresh Organic Fruit'],
    dimensions: 'Main Lounge',
    sanitizationLevel: 'Continuous HEPA Air Filtered',
  },
  {
    id: 'photo-7',
    title: 'Swedish Thermal Hydraulic Therapy Table',
    subtitle: 'Precision Electric Height Adjustment',
    category: 'equipment',
    categoryLabel: 'Professional Equipment',
    url: 'https://images.unsplash.com/photo-1512290900673-7002e8674996?q=80&w=1400&auto=format&fit=crop',
    description: 'Ultra-plush 4-inch memory foam massage beds with integrated dual-zone heating panels and face cradles engineered for pressure relief during long sessions.',
    highlights: ['4-Inch Memory Foam', 'Integrated Dual-Zone Heater', 'Hydraulic Height Adjustment', 'Pressure-Relief Face Cradle'],
    dimensions: 'Standard Equipment',
    sanitizationLevel: 'Linen Changed Every Session',
  },
  {
    id: 'photo-8',
    title: 'Botanical Eucalyptus Steam Chamber',
    subtitle: 'Deep Pore Detoxification',
    category: 'hydrotherapy',
    categoryLabel: 'Hydrotherapy & Steam',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1400&auto=format&fit=crop',
    description: 'Private marble steam bath generating 100% humidity infused with natural eucalyptus vapor to open respiratory pathways and soften muscle fascia prior to therapy.',
    highlights: ['Italian Marble Lining', 'Eucalyptus Vapor Mist', 'Built-in Ergonomic Bench', 'Private Touch Controls'],
    dimensions: 'Steam Suite 2',
    sanitizationLevel: 'Steam Auto-Sanitized',
  },
  {
    id: 'photo-9',
    title: 'Atmospheric Warm Lighting & Zen Décor',
    subtitle: 'Calming Minimalist Aesthetics',
    category: 'ambiance',
    categoryLabel: 'Ambiance & Lounge',
    url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1400&auto=format&fit=crop',
    description: 'Curated warm 2700K ambient illumination and natural bamboo accents designed to reduce cortisol levels and encourage immediate psychological relaxation.',
    highlights: ['Dimmable Ambient 2700K', 'Natural Bamboo & Slate', 'Acoustic Wall Panels', 'Calm Water Fountains'],
    dimensions: 'All Sanctuary Areas',
    sanitizationLevel: 'Sanitized Daily',
  }
];

export const GalleryPage: React.FC<GalleryPageProps> = ({ photos, onOpenBooking }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Prefer live API content; the static showcase is only a fallback when this
  // component is used without the wrapper (no data injected).
  const galleryPhotos = photos || GALLERY_DATA;

  const categories = [
    { id: 'all', label: 'All Collections', count: galleryPhotos.length },
    { id: 'suites', label: 'VIP Therapy Suites', count: galleryPhotos.filter(i => i.category === 'suites').length },
    { id: 'hydrotherapy', label: 'Hydrotherapy & Steam', count: galleryPhotos.filter(i => i.category === 'hydrotherapy').length },
    { id: 'equipment', label: 'Professional Equipment', count: galleryPhotos.filter(i => i.category === 'equipment').length },
    { id: 'ambiance', label: 'Ambiance & Lounge', count: galleryPhotos.filter(i => i.category === 'ambiance').length },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === activeCategory);

  const currentPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  }, [lightboxIndex, filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [lightboxIndex, filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  return (
    <div className="py-12 bg-[#0C1214] text-gray-100 min-h-screen font-sans">
      <SEO
        title="Sanctuary Suite & Facility Gallery | Aura Luxe Spa"
        description="Take a high-resolution visual tour of our hospital-grade disinfected VIP therapy suites, hydrotherapy lounges, and professional massage equipment."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#2CB5A0] bg-[#2CB5A0]/15 px-4 py-1.5 rounded-full border border-[#2CB5A0]/30 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Visual Sanctuary Tour</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
            Facilities, Equipment & Ambiance
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Take an exclusive inside look at our soundproof VIP suites, Italian marble hydrotherapy tubs, and medical-grade sanitized equipment crafted for ultimate male wellness.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {categories.map((c) => {
            const isSelected = activeCategory === c.id;
            return (
              <button
                key={c.id}
                id={`gallery-filter-${c.id}`}
                onClick={() => {
                  setActiveCategory(c.id);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-linear-to-r from-[#2CB5A0] to-[#1A6E61] text-white border-transparent shadow-lg shadow-[#2CB5A0]/20 scale-105'
                    : 'bg-[#141C1E] border-white/10 text-gray-400 hover:text-white hover:bg-[#182225] hover:border-white/20'
                }`}
              >
                <span>{c.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'}`}>
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightboxIndex(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${photo.title} in fullscreen`}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-[#141C1E] shadow-xl focus:outline-none focus:ring-2 focus:ring-[#2CB5A0]/60"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Top Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-black bg-[#E3C99B] px-3 py-1 rounded-full shadow-md">
                  {photo.categoryLabel}
                </span>
              </div>

              {/* Bottom Glass Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0C1214] via-[#0C1214]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity p-6 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 text-[#81E3D4] text-xs font-bold mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click for Fullscreen Lightbox</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#81E3D4] transition-colors leading-snug">
                  {photo.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                  {photo.subtitle}
                </p>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {photo.sanitizationLevel}
                  </span>
                  <span className="font-mono text-gray-400">{photo.dimensions}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Banner */}
        <div className="p-8 rounded-3xl bg-linear-to-r from-[#142023] via-[#1A2C30] to-[#142023] border border-[#2CB5A0]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CB5A0] bg-[#2CB5A0]/15 px-3 py-1 rounded-full border border-[#2CB5A0]/30">
              Private Spa Suite Reservations
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              Ready to Experience Our VIP Suites Firsthand?
            </h3>
            <p className="text-xs text-gray-300 max-w-xl">
              Reserve your individual session with a certified male therapist. All bookings include private suite access, steam sauna, and post-treatment tea lounge.
            </p>
          </div>

          <button
            id="gallery-book-now-btn"
            onClick={() => onOpenBooking && onOpenBooking()}
            className="px-8 py-4 rounded-2xl bg-linear-to-r from-[#2CB5A0] to-[#1A6E61] hover:brightness-110 text-white font-bold text-sm shadow-xl flex items-center gap-2 shrink-0 cursor-pointer transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Private Suite Session</span>
          </button>
        </div>
      </div>

      {/* FULLSCREEN LUXURY LIGHTBOX MODAL */}
      <AnimatePresence>
        {currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox viewer"
          >
            {/* Close Button */}
            <button
              id="lightbox-close-btn"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Arrow */}
            <button
              id="lightbox-prev-btn"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 hover:bg-[#2CB5A0] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:border-transparent shadow-xl"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              id="lightbox-next-btn"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 hover:bg-[#2CB5A0] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:border-transparent shadow-xl"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Main Container */}
            <div className="w-full max-w-6xl max-h-[92vh] bg-[#121A1C] rounded-3xl border border-white/15 overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
              {/* Photo Display Viewport */}
              <div className="flex-1 bg-black flex items-center justify-center relative min-h-75 lg:min-h-[550px] p-4">
                <motion.img
                  key={currentPhoto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  src={currentPhoto.url}
                  alt={currentPhoto.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                />

                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-gray-300 font-mono border border-white/10">
                  Image {lightboxIndex! + 1} of {filteredPhotos.length}
                </div>
              </div>

              {/* Photo Details Sidebar */}
              <div className="w-full lg:w-96 p-6 sm:p-8 bg-[#141E20] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between overflow-y-auto max-h-[40vh] lg:max-h-[92vh]">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-black bg-[#E3C99B] px-3 py-1 rounded-full inline-block mb-3">
                      {currentPhoto.categoryLabel}
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-white leading-snug">
                      {currentPhoto.title}
                    </h2>
                    <p className="text-xs text-[#81E3D4] font-medium mt-1">
                      {currentPhoto.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {currentPhoto.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                      Facility & Suite Highlights
                    </span>
                    <div className="space-y-2">
                      {currentPhoto.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-200">
                          <CheckCircle2 className="w-4 h-4 text-[#2CB5A0] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sanitization & Specs */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Hygiene Standard:
                      </span>
                      <span className="font-bold text-emerald-300">{currentPhoto.sanitizationLevel}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400 font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[#E3C99B]" /> Suite Dimensions:
                      </span>
                      <span className="font-bold text-white font-mono">{currentPhoto.dimensions}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action inside Lightbox */}
                <div className="pt-6 border-t border-white/10 space-y-3 mt-6">
                  <button
                    id="lightbox-book-suite-btn"
                    onClick={() => {
                      setLightboxIndex(null);
                      if (onOpenBooking) onOpenBooking();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#2CB5A0] to-[#1A6E61] hover:brightness-110 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Session in This Suite</span>
                  </button>
                  <p className="text-[11px] text-gray-400 text-center">
                    Use <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">←</kbd>{' '}
                    <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">→</kbd> keys to navigate photos
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
