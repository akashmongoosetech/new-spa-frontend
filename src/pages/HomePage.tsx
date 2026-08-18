import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Phone,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  MessageCircle,
  Play,
  Heart
} from 'lucide-react';
import { BusinessSettings, Service, Therapist, Testimonial, BlogPost } from '../types';
import { SEO } from '../components/ui/SEO';
import { Hero } from '../components/home/Hero';
import { TestimonialCarousel } from '../components/home/TestimonialCarousel';

interface HomePageProps {
  settings: BusinessSettings;
  services: Service[];
  therapists: Therapist[];
  testimonials: Testimonial[];
  blogs: BlogPost[];
  onOpenBooking: (serviceId?: string) => void;
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  services,
  therapists,
  testimonials,
  blogs,
  onOpenBooking,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const safeServices = services || [];
  const safeTherapists = therapists || [];
  const safeTestimonials = testimonials || [];

  const filteredServices =
    selectedCategory === 'all'
      ? safeServices
      : safeServices.filter((s) => s?.category === selectedCategory);

  const faqs = [
    {
      q: 'Is Aura Luxe strictly a professional Men-to-Men massage therapy spa?',
      a: 'Yes. Aura Luxe is Indore\'s premier licensed Men-to-Men massage therapy center. All our therapists are certified male practitioners dedicated to providing elite therapeutic wellness in an ethical, comfortable, and highly professional sanctuary.'
    },
    {
      q: 'How do I book an appointment with my preferred male therapist?',
      a: 'You can select your preferred therapist (Rajesh, Vikram, Arjun, or Sameer) directly in our real-time booking calendar. You can also pick "Any Therapist" for maximum time flexibility.'
    },
    {
      q: 'What hygiene and sanitation protocols are observed?',
      a: 'We adhere to clinical-grade sanitization standards. Every suite, massage table, and linen set is disinfected with UV-C technology and fresh prior to every single appointment. Private luxury shower facilities are provided.'
    },
    {
      q: 'What is your cancellation and rescheduling policy?',
      a: 'You may cancel or reschedule your reservation up to 4 hours before your scheduled appointment without any penalty fee.'
    }
  ];

  return (
    <div className="space-y-20 font-sans bg-[#FAFAFA] text-[#1A1A1A]">
      <SEO />

      {/* HERO SECTION */}
      <Hero
        settings={settings}
        onOpenBooking={onOpenBooking}
        setActiveTab={setActiveTab}
      />

      {/* STATS COUNTUP BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="block text-3xl sm:text-4xl font-serif font-extrabold text-[#2CB5A0]">
              99.4%
            </span>
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Satisfaction Rate
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-3xl sm:text-4xl font-serif font-extrabold text-[#1A1A1A]">
              10+ Yrs
            </span>
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Licensed Experience
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-3xl sm:text-4xl font-serif font-extrabold text-[#C7A36A]">
              4,800+
            </span>
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Therapies Completed
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-3xl sm:text-4xl font-serif font-extrabold text-[#2CB5A0]">
              100%
            </span>
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Privacy Guaranteed
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Signature Treatments
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Tailored Men's Massage Therapies
          </h2>
          <p className="text-gray-600 text-sm">
            Each therapy session is customized to your body's pressure requirements and relaxation needs.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Therapies' },
            { id: 'relaxation', label: 'Relaxation & Swedish' },
            { id: 'deep_tissue', label: 'Deep Tissue & Sports' },
            { id: 'specialized', label: 'Hot Stone & Specialized' },
            { id: 'vip_packages', label: 'VIP Executive Packages' },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`category-tab-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={srv.imageUrl}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                    {settings.currencySymbol || '₹'}{srv.price}
                  </div>
                  {srv.featured && (
                    <div className="absolute top-4 left-4 bg-[#C7A36A] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Popular
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#2CB5A0]" />
                    <span>{srv.durationMinutes} Minutes Session</span>
                    <span>•</span>
                    <span className="text-amber-600 font-bold">★ {srv.rating}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-[#2CB5A0] transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {srv.shortDescription}
                  </p>

                  <div className="pt-2 space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Key Session Benefits:
                    </span>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {(srv.benefits || []).slice(0, 2).map((b, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2CB5A0] shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  id={`home-book-service-${srv.id}`}
                  onClick={() => onOpenBooking(srv.id)}
                  className="w-full py-3 rounded-2xl bg-teal-50 hover:bg-[#2CB5A0] text-[#2CB5A0] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Therapy</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-10">
          <button
            onClick={() => setActiveTab('services')}
            className="px-8 py-3.5 rounded-2xl border border-gray-300 text-gray-800 font-bold text-sm hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <span>View Complete Therapy Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FEATURED MALE THERAPISTS */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
              Licensed Practitioners
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
              Meet Our Certified Male Therapists
            </h2>
            <p className="text-gray-600 text-sm">
              Highly trained practitioners with years of experience in human anatomy, sports rehabilitation, and holistic wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {safeTherapists.map((th) => (
              <div
                key={th.id}
                className="bg-[#FAFAFA] rounded-3xl p-5 border border-gray-100 text-center space-y-4 hover:shadow-lg transition-all"
              >
                <img
                  src={th.imageUrl}
                  alt={th.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-white shadow-md"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-900">{th.name}</h3>
                  <p className="text-xs text-[#2CB5A0] font-semibold mt-0.5">{th.title}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {th.bio}
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  {(th.specialties || []).map((spec, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-white border text-[10px] font-medium text-gray-600">
                      {spec}
                    </span>
                  ))}
                </div>
                <button
                  id={`book-therapist-${th.id}`}
                  onClick={() => onOpenBooking()}
                  className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#2CB5A0] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Book with {(th.name || '').split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Effortless Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            How Your Spa Experience Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Select Therapy & Slot',
              desc: 'Choose your desired therapy, preferred therapist, date, and live time slot in our online reservation portal.'
            },
            {
              step: '02',
              title: 'Arrive at Private Suite',
              desc: 'Enjoy complimentary private steam, hydrotherapy shower, and fresh plush robes 10 minutes prior to session.'
            },
            {
              step: '03',
              title: 'Restorative Bodywork',
              desc: 'Experience customized massage pressure designed to eliminate muscle fatigue and leave you deeply renewed.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-teal-50 shadow-sm relative space-y-4">
              <span className="text-4xl font-serif font-extrabold text-teal-100 block">
                {item.step}
              </span>
              <h3 className="text-xl font-serif font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ELEGANT TESTIMONIALS CAROUSEL */}
      <TestimonialCarousel
        testimonials={safeTestimonials}
        onOpenBooking={onOpenBooking}
      />

      {/* FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  id={`faq-toggle-${idx}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-gray-900 text-sm flex justify-between items-center gap-4 hover:bg-gray-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#2CB5A0]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT MAP & CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-gray-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-[#6FD3C4] uppercase tracking-widest">
                Ready for Deep Relaxation?
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Book Your Executive Session Today
              </h2>
              <p className="text-gray-300 text-sm max-w-xl">
                Experience the finest Men-to-Men massage therapy in Indore, Ujjain, Dewas. Immediate online slot confirmation.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                id="footer-cta-book-btn"
                onClick={() => onOpenBooking()}
                className="w-full py-4 rounded-2xl bg-[#2CB5A0] hover:bg-[#259b89] text-white font-bold text-sm shadow-lg text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Reserve Appointment</span>
              </button>
              <a
                href={`tel:${settings.phone}`}
                className="w-full py-3.5 rounded-2xl border border-gray-700 text-gray-300 hover:text-white font-semibold text-xs text-center flex items-center justify-center gap-2 hover:bg-white/5"
              >
                <Phone className="w-4 h-4 text-[#2CB5A0]" />
                <span>Direct Line: {settings.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
