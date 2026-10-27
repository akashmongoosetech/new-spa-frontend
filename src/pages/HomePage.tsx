import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Phone,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { BusinessSettings, Service, Therapist } from '../types';
import { publicWorkingHours } from '../utils/settings';
import { Hero } from '../components/home/Hero';
import { EntityImage } from '../components/ui/EntityImage';

interface HomePageProps {
  settings: BusinessSettings;
  services: Service[];
  therapists: Therapist[];
  onOpenBooking: (serviceId?: string) => void;
  setActiveTab: (tab: string) => void;
}

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Therapies' },
  { id: 'relaxation', label: 'Relaxation & Swedish' },
  { id: 'deep_tissue', label: 'Deep Tissue & Sports' },
  { id: 'specialized', label: 'Hot Stone & Specialized' },
  { id: 'vip_packages', label: 'Packages' },
];

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  services,
  therapists,
  onOpenBooking,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const safeServices = services || [];
  const safeTherapists = therapists || [];
  const currencySymbol = settings?.currencySymbol || '₹';

  const filteredServices =
    selectedCategory === 'all'
      ? safeServices
      : safeServices.filter((service) => service?.category === selectedCategory);

  const factualDetails = [
    {
      icon: Clock,
      label: 'Appointment hours',
      value: publicWorkingHours(settings?.workingHours),
    },
    {
      icon: MapPin,
      label: 'Service area',
      value: settings?.address || settings?.city || 'Indore, Ujjain & Dewas',
    },
    {
      icon: Phone,
      label: 'Concierge',
      value: settings?.phone || 'Contact by email',
    },
    {
      icon: Calendar,
      label: 'Booking',
      value: 'Online appointment requests',
    },
  ];

  return (
    <div className="space-y-20 bg-[#FAFAFA] font-sans text-[#1A1A1A]">
      <Hero
        settings={settings}
        services={safeServices}
        onOpenBooking={onOpenBooking}
        setActiveTab={setActiveTab}
      />

      <section className="relative z-20 mx-auto -mt-12 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 rounded-3xl border border-brand-100 bg-white p-7 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
          {factualDetails.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3 rounded-2xl bg-[#FAFAFA] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-[var(--brand-ink)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block break-words text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
            Therapy Menu
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            Men's Massage Therapies
          </h2>
          <p className="text-sm text-gray-600">
            View current therapies, session lengths and prices. The concierge will confirm your
            appointment details.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              id={`category-tab-${category.id}`}
              onClick={() => setSelectedCategory(category.id)}
              className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <EntityImage
                      src={service.imageUrl}
                      alt={`${service.title} at Tripod Wellness`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholderClassName="h-full w-full"
                      label={service.title}
                    />
                    <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 font-mono text-xs font-bold text-white backdrop-blur-md">
                      {currencySymbol}
                      {service.price}
                    </div>
                    {service.featured && (
                      <div className="absolute left-4 top-4 rounded-full bg-[#BFA476] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-950">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Clock className="h-3.5 w-3.5 text-[var(--brand-ink)]" />
                      <span>{service.durationMinutes} minute session</span>
                      {service.category && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{service.category.replaceAll('_', ' ')}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-gray-900 transition-colors group-hover:text-[var(--brand-ink)]">
                      {service.title}
                    </h3>

                    <p className="line-clamp-3 text-xs leading-relaxed text-gray-600">
                      {service.shortDescription}
                    </p>

                    {(service.benefits || []).length > 0 && (
                      <div className="space-y-1 pt-2">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Session notes
                        </span>
                        <ul className="space-y-1 text-xs text-gray-700">
                          {(service.benefits || []).slice(0, 2).map((benefit, index) => (
                            <li key={index} className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--brand-ink)]" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    id={`home-book-service-${service.id}`}
                    onClick={() => onOpenBooking(service.id)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-50 py-3 text-xs font-bold text-[var(--brand-ink)] shadow-sm transition-all hover:bg-brand-500 hover:text-brand-950"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Request this therapy</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[var(--brand-ink)]" />
            <h3 className="mt-3 font-serif text-xl font-bold text-gray-900">
              Therapy details are being updated
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
              Please contact the concierge for the current therapy menu, session lengths and prices.
            </p>
            <button
              onClick={() => setActiveTab('contact')}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950"
            >
              Contact concierge <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="pt-10 text-center">
          <button
            onClick={() => setActiveTab('services')}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-8 py-3.5 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-100"
          >
            <span>View complete therapy menu</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {safeTherapists.length > 0 && (
        <section className="border-y border-gray-100 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
                Our Team
              </span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
                Meet Our Male Massage Therapists
              </h2>
              <p className="text-sm text-gray-600">
                View team profiles and specialties, then choose an appointment time with the
                concierge.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {safeTherapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className="space-y-4 rounded-3xl border border-gray-100 bg-[#FAFAFA] p-5 text-center transition-all hover:shadow-lg"
                >
                  <div className="mx-auto h-28 w-28 overflow-hidden rounded-full shadow-md ring-4 ring-white">
                    <EntityImage
                      src={therapist.photoUrl || therapist.imageUrl}
                      alt={`${therapist.name}, massage therapist`}
                      className="h-full w-full object-cover"
                      placeholderClassName="h-full w-full rounded-full"
                      label={therapist.name}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-900">{therapist.name}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-[var(--brand-ink)]">
                      {therapist.title}
                    </p>
                  </div>
                  <p className="line-clamp-3 text-xs leading-relaxed text-gray-600">{therapist.bio}</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {(therapist.specialties || []).map((specialty, index) => (
                      <span
                        key={index}
                        className="rounded-md border bg-white px-2.5 py-0.5 text-[10px] font-medium text-gray-600"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <button
                    id={`book-therapist-${therapist.id}`}
                    onClick={() => onOpenBooking()}
                    className="w-full cursor-pointer rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-500 hover:text-brand-950"
                  >
                    Book with {(therapist.name || '').split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-10 text-center">
              <button
                onClick={() => setActiveTab('therapists')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-ink)] hover:underline"
              >
                View therapist directory <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
            How It Works
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            Booking an Appointment
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Choose therapy and time',
              description:
                'Select a therapy, preferred therapist, date and available time, then enter your contact details.',
            },
            {
              step: '02',
              title: 'Send your request',
              description:
                'The booking request is sent to the concierge. You will receive an email confirmation with the appointment details.',
            },
            {
              step: '03',
              title: 'Attend your appointment',
              description:
                'Contact the concierge before your visit if you need directions, to reschedule, or to ask a question.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative space-y-4 rounded-3xl border border-brand-50 bg-white p-8 shadow-sm"
            >
              <span className="block font-serif text-4xl font-extrabold text-brand-100">{item.step}</span>
              <h3 className="font-serif text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs leading-relaxed text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <button
            onClick={() => setActiveTab('faq')}
            className="group rounded-3xl border border-gray-200 bg-white p-7 text-left transition-all hover:border-[#BFA476] hover:shadow-lg"
          >
            <HelpCircle className="h-7 w-7 text-[var(--brand-ink)]" />
            <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">Questions about booking?</h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Read published answers about appointments, therapies and privacy.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--brand-ink)]">
              View FAQ <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className="group rounded-3xl border border-gray-200 bg-white p-7 text-left transition-all hover:border-[#BFA476] hover:shadow-lg"
          >
            <MessageCircle className="h-7 w-7 text-[var(--brand-ink)]" />
            <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">Need help from the concierge?</h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Send a message or use the phone and WhatsApp details on the contact page.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--brand-ink)]">
              Contact us <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="on-dark-brand relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-950 via-[#201A14] to-[#120F0B] p-8 text-white shadow-2xl sm:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
                Book an Appointment
              </span>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                Send a Private Appointment Request
              </h2>
              <p className="max-w-xl text-sm text-gray-300">
                Choose a therapy and preferred time online. The concierge will confirm availability
                and send the appointment details by email.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4">
              <button
                id="footer-cta-book-btn"
                onClick={() => onOpenBooking()}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4 text-sm font-bold text-brand-950 shadow-lg hover:bg-brand-400"
              >
                <Calendar className="h-5 w-5" />
                <span>Request Appointment</span>
              </button>
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-700 py-3.5 text-center text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  <Phone className="h-4 w-4 text-[var(--brand-ink)]" />
                  <span>Direct line: {settings.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
