import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  ShieldCheck,
  Award,
  Sparkles,
  Pause,
  Play,
  CheckCircle2,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  onOpenBooking?: (serviceId?: string) => void;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  onOpenBooking
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    {
      id: "tst-1",
      clientName: "Rahul Sharma",
      role: "Management Consultant, Indore",
      rating: 5,
      comment: "Tripod Wellness is in a league of its own. The ambiance is calming, the hygiene is immaculate, and Rajesh gave me the best Deep Tissue massage I've ever had in my life. The privacy and professionalism are unmatched.",
      serviceTitle: "Deep Tissue Muscle Recovery Therapy",
      date: "2 days ago",
      approved: true,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "tst-2",
      clientName: "Akash Verma",
      role: "Senior Software Architect, Indore",
      rating: 5,
      comment: "Sitting 10 hours a day at my desk left my lower back and neck in terrible tightness. Arjun's Herbal Oil therapy completely eliminated my stiffness. The private suite and steam room made it an executive sanctuary.",
      serviceTitle: "Kerala Authentic Herbal Oil Massage",
      date: "1 week ago",
      approved: true,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "tst-3",
      clientName: "Vikram Singh",
      role: "Managing Director, Nariman Point",
      rating: 5,
      comment: "The Royal Maharaja VIP package was an extraordinary weekend experience. Private Jacuzzi, exceptional service, organic aromatic oils, and complete executive privacy. Highly recommended for busy leaders.",
      serviceTitle: "Royal Maharaja VIP Luxury Experience",
      date: "2 weeks ago",
      approved: true,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "tst-4",
      clientName: "Rohit Patel",
      role: "Founder & Entrepreneur, Ujjain",
      rating: 5,
      comment: "Authentic Ayurvedic Abhyanga massage with genuine herbal oils. The male bodywork specialists are extremely respectful, soft-spoken, and masters of pressure point techniques.",
      serviceTitle: "Ayurvedic Abhyanga Massage",
      date: "3 weeks ago",
      approved: true,
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop"
    }
  ];

  const filteredList = activeFilter === 'All'
    ? displayTestimonials
    : displayTestimonials.filter(t => t.serviceTitle?.toLowerCase().includes(activeFilter.toLowerCase()));

  const listToUse = filteredList.length > 0 ? filteredList : displayTestimonials;

  useEffect(() => {
    if (!isAutoplay) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % listToUse.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplay, listToUse.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % listToUse.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + listToUse.length) % listToUse.length);
  };

  const current = listToUse[currentIndex % listToUse.length] || listToUse[0];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96
    })
  };

  return (
    <section className="bg-linear-to-b from-[#0B0F10] via-[#0E1517] to-[#0A0E10] text-white py-20 relative overflow-hidden border-y border-white/10">
      {/* Background Decorative Lighting Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#2CB5A0]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#C7A36A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#182325] border border-[#2CB5A0]/30 text-[#81E3D4] text-xs font-semibold uppercase tracking-widest shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E3C99B]" /> Guest Endorsements
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight"
          >
            What Discerning Gentlemen Say
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          >
            Unedited reviews from Indore, Ujjain, Dewas executive leaders, corporate directors, and wellness connoisseurs who trust Tripod Wellness as their private restorative sanctuary.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative">
          {/* Main Card Wrapper */}
          <div
            className="relative bg-[#121A1C]/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl overflow-hidden min-h-85 flex flex-col justify-between"
            onMouseEnter={() => setIsAutoplay(false)}
            onMouseLeave={() => setIsAutoplay(true)}
          >
            {/* Giant Background Watermark Quote */}
            <Quote className="absolute -top-4 -left-4 w-36 h-36 text-white/5 pointer-events-none rotate-180" />
            <Quote className="absolute -bottom-6 -right-6 w-36 h-36 text-[#2CB5A0]/5 pointer-events-none" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id || currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative z-10 space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Header Row: Service Badge & Star Rating */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-[#2CB5A0]/20 border border-[#2CB5A0]/40 text-[#81E3D4] text-xs font-semibold">
                      {current.serviceTitle || 'Full Body Recovery'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#E3C99B] bg-[#C7A36A]/10 px-2.5 py-0.5 rounded-md border border-[#C7A36A]/30">
                      <ShieldCheck className="w-3 h-3 text-[#C7A36A]" /> Verified Guest
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(current.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-white ml-1">{(current.rating || 5).toFixed(1)}</span>
                  </div>
                </div>

                {/* Review Quote Text */}
                <blockquote className="text-base sm:text-xl font-serif italic text-gray-100 leading-relaxed sm:leading-loose pt-2">
                  "{current.comment}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    {/* Avatar or Initials */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C7A36A] bg-linear-to-tr from-[#1A6E61] to-[#2CB5A0] flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                      {current.avatarUrl ? (
                        <img
                          src={current.avatarUrl}
                          alt={current.clientName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{current.clientName ? current.clientName.charAt(0) : 'G'}</span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
                        {current.clientName}
                        <CheckCircle2 className="w-4 h-4 text-[#2CB5A0]" />
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">{current.role}</p>
                    </div>
                  </div>

                  <span className="text-xs text-gray-500 hidden sm:inline-block font-mono">
                    {current.date}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Controls Row inside card */}
            <div className="mt-8 pt-4 flex items-center justify-between gap-4 border-t border-white/5 relative z-20">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {listToUse.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex % listToUse.length
                        ? 'w-8 bg-[#2CB5A0] shadow-sm shadow-[#2CB5A0]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Autoplay Toggle & Arrow Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoplay(!isAutoplay)}
                  title={isAutoplay ? 'Pause Carousel' : 'Autoplay Carousel'}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors cursor-pointer mr-2"
                >
                  {isAutoplay ? <Pause className="w-3.5 h-3.5 text-[#2CB5A0]" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                </button>

                <button
                  onClick={handlePrev}
                  aria-label="Previous Review"
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#2CB5A0] hover:bg-[#2CB5A0] text-gray-200 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Next Review"
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#2CB5A0] hover:bg-[#2CB5A0] text-gray-200 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Stat Metrics */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="block text-2xl font-serif font-extrabold text-[#81E3D4]">4.98 / 5</span>
            <span className="text-xs text-gray-400 font-medium">Average Guest Rating</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="block text-2xl font-serif font-extrabold text-[#E3C99B]">500+</span>
            <span className="text-xs text-gray-400 font-medium">Verified Reviews</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="block text-2xl font-serif font-extrabold text-emerald-400">100%</span>
            <span className="text-xs text-gray-400 font-medium">Confidential & Private</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="block text-2xl font-serif font-extrabold text-teal-300">Licensed</span>
            <span className="text-xs text-gray-400 font-medium">Male Specialists</span>
          </div>
        </div>

        {/* Action button if provided */}
        {onOpenBooking && (
          <div className="mt-10 text-center">
            <button
              onClick={() => onOpenBooking()}
              className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#2CB5A0] to-[#1A6E61] text-white font-bold text-sm shadow-xl hover:shadow-[#2CB5A0]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#E3C99B]" />
              <span>Experience Tripod Wellness Today</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialCarousel;
