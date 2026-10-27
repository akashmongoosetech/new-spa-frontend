import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2, ChevronLeft, ChevronRight, X, Sparkles, Camera, ArrowRight, Calendar } from 'lucide-react';
import { BusinessSettings } from '../types';
import { EntityImage } from '../components/ui/EntityImage';
import { SEO } from '../components/ui/SEO';
import { isUnverifiedStockImage } from '../utils/media';

interface GalleryPageProps {
  settings?: BusinessSettings;
  photos?: GalleryPhoto[];
  onOpenBooking?: (serviceId?: string) => void;
  setActiveTab?: (tab: string) => void;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  subtitle?: string;
  category: 'suites' | 'equipment' | 'ambiance' | 'hydrotherapy';
  categoryLabel: string;
  url: string;
  description?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  suites: 'Therapy Rooms',
  hydrotherapy: 'Hydrotherapy',
  equipment: 'Equipment',
  ambiance: 'Ambiance',
};

export const GalleryPage: React.FC<GalleryPageProps> = ({ photos, onOpenBooking, setActiveTab }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Only approved, non-stock imagery is shown as a Tripod Wellness facility photo.
  const galleryPhotos = (photos || []).filter(
    (photo) => photo.url && !isUnverifiedStockImage(photo.url)
  );

  const categories = [
    { id: 'all', label: 'All Photos', count: galleryPhotos.length },
    ...Object.entries(CATEGORY_LABELS)
      .map(([id, label]) => ({
        id,
        label,
        count: galleryPhotos.filter((photo) => photo.category === id).length,
      }))
      .filter((category) => category.count > 0),
  ];

  const filteredPhotos =
    activeCategory === 'all'
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === activeCategory);

  const currentPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  }, [lightboxIndex, filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [lightboxIndex, filteredPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrev();
      if (event.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  return (
    <div className="on-dark-brand min-h-screen bg-[#120F0B] py-12 font-sans text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFA476]/30 bg-brand-500/15 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[var(--brand-ink)] shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Facility Gallery</span>
          </span>
          <h1 className="font-serif text-3xl font-bold leading-tight text-white sm:text-5xl">
            Therapy Rooms & Facility Photos
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-400">
            Approved facility photography is published here. If an image has not been supplied, the
            gallery shows a placeholder instead of a stock photo presented as our location.
          </p>
        </div>

        {galleryPhotos.length > 0 ? (
          <>
            <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const isSelected = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    id={`gallery-filter-${category.id}`}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setLightboxIndex(null);
                    }}
                    className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'scale-105 border-transparent bg-linear-to-r from-[#C3AA7E] to-[#BFA476] text-brand-950 shadow-lg shadow-[#BFA476]/20'
                        : 'border-white/10 bg-[#201A14] text-gray-400 hover:border-white/20 hover:bg-[#241D16] hover:text-white'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={photo.id}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#1B1611] shadow-lg"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <EntityImage
                      src={photo.url}
                      alt={photo.title || 'Tripod Wellness facility photo'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholderClassName="h-full w-full"
                      label={photo.title || 'Tripod Wellness'}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md">
                      <Maximize2 className="h-4 w-4" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-ink)]">
                        {photo.categoryLabel || CATEGORY_LABELS[photo.category] || 'Facility'}
                      </span>
                      <h2 className="mt-1 font-serif text-lg font-bold text-white">{photo.title}</h2>
                      {photo.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-300">{photo.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#1B1611] p-8 text-center shadow-2xl sm:p-10">
            <SEO
              title="Facility Gallery | Tripod Wellness"
              description="View the Tripod Wellness facility gallery. Facility photography is published only when approved; contact the concierge for images and appointment details."
              robots="noindex, nofollow"
            />
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-[var(--brand-ink)]">
              <Camera className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Approved Photos Coming Soon</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Facility photography has not been published yet. Contact the concierge for current
              images or to ask about the appointment space.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setActiveTab?.('contact')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950"
              >
                Contact concierge <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onOpenBooking?.()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                <Calendar className="h-4 w-4" /> Book appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {currentPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={currentPhoto.title}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white hover:bg-white/10"
            aria-label="Close image"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white hover:bg-white/10 sm:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white hover:bg-white/10 sm:right-8"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#1B1611]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="max-h-[72vh] overflow-hidden">
              <EntityImage
                src={currentPhoto.url}
                alt={currentPhoto.title || 'Tripod Wellness facility photo'}
                className="max-h-[72vh] w-full object-contain"
                placeholderClassName="h-[60vh] w-full"
                label={currentPhoto.title || 'Tripod Wellness'}
                loading="eager"
              />
            </div>
            <div className="space-y-2 p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-ink)]">
                {currentPhoto.categoryLabel || CATEGORY_LABELS[currentPhoto.category] || 'Facility'}
              </span>
              <h2 className="font-serif text-xl font-bold text-white">{currentPhoto.title}</h2>
              {currentPhoto.description && (
                <p className="text-sm leading-relaxed text-gray-400">{currentPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
