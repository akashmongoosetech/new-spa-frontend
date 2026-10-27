import React from 'react';
import { Calendar, MessageCircle, ShieldCheck, Users, Sparkles } from 'lucide-react';
import { Therapist, BusinessSettings } from '../types';
import { EntityImage } from '../components/ui/EntityImage';

interface AboutPageProps {
  therapists: Therapist[];
  settings: BusinessSettings;
  onOpenBooking: () => void;
  setActiveTab?: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  therapists,
  settings,
  onOpenBooking,
  setActiveTab,
}) => {
  return (
    <div className="min-h-screen space-y-16 bg-[#FAFAFA] py-12 font-sans">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-6">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
              About Tripod Wellness
            </span>
            <h1 className="font-serif text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              Men-to-Men Massage Therapy in Indore
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              Tripod Wellness provides massage therapy appointments for men in Indore, Ujjain and
              Dewas. The current therapy menu, session lengths, prices and team profiles are
              published on this site.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Appointments are requested online or through the concierge. If a detail is not
              published here, please ask before booking rather than relying on an assumption.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-4 text-xs font-bold text-gray-800 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[var(--brand-ink)]" />
                <span>Men-to-men massage appointments</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <Calendar className="h-5 w-5 text-[var(--brand-ink)]" />
                <span>Online appointment requests</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#BFA476]/30 bg-linear-to-br from-[#1B1611] via-[#2A221A] to-[#120F0B] p-8 text-white shadow-2xl sm:p-10">
              <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#BFA476]/15 blur-3xl" />
              <Sparkles className="h-8 w-8 text-[var(--brand-ink)]" />
              <h2 className="mt-5 font-serif text-2xl font-bold">Facility imagery</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                Facility photography is published only when approved. Until then, the gallery shows
                a placeholder rather than a stock image presented as our location.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab?.('gallery')}
                  className="rounded-xl bg-brand-500 px-5 py-3 text-xs font-bold text-brand-950"
                >
                  View gallery
                </button>
                <button
                  onClick={() => setActiveTab?.('contact')}
                  className="rounded-xl border border-white/20 px-5 py-3 text-xs font-bold text-white hover:bg-white/10"
                >
                  Contact concierge
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 rounded-3xl border border-brand-50 bg-white p-8 shadow-md sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900">What You Can Verify</h2>
            <p className="mt-2 text-sm text-gray-600">
              We publish information that can be checked against the current service menu and team
              records.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 text-xs md:grid-cols-3">
            <div className="space-y-3 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-brand-950">
                01
              </div>
              <h3 className="font-serif text-base font-bold text-gray-900">Therapy details</h3>
              <p className="leading-relaxed text-gray-600">
                Session lengths, prices and descriptions come from the current therapy menu.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-brand-950">
                02
              </div>
              <h3 className="font-serif text-base font-bold text-gray-900">Team profiles</h3>
              <p className="leading-relaxed text-gray-600">
                Therapist names, roles, specialties and stated experience appear on their profiles.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-brand-950">
                03
              </div>
              <h3 className="font-serif text-base font-bold text-gray-900">Contact details</h3>
              <p className="leading-relaxed text-gray-600">
                Phone, email, WhatsApp and the service area are listed on the contact page.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
              Our Team
            </span>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Meet Our Male Massage Therapists</h2>
            <p className="text-xs text-gray-600">
              View published profiles for the therapists currently listed.
            </p>
          </div>

          {therapists.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {therapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm"
                >
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-brand-50">
                    <EntityImage
                      src={therapist.photoUrl || therapist.imageUrl}
                      alt={`${therapist.name}, massage therapist`}
                      className="h-full w-full object-cover"
                      placeholderClassName="h-full w-full rounded-full"
                      label={therapist.name}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{therapist.name}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-[var(--brand-ink)]">
                      {therapist.title}
                    </p>
                    {therapist.experienceYears > 0 && (
                      <p className="mt-1 text-[11px] text-gray-500">
                        {therapist.experienceYears} years stated experience
                      </p>
                    )}
                  </div>
                  <p className="line-clamp-3 text-xs leading-relaxed text-gray-600">{therapist.bio}</p>
                  <button
                    onClick={onOpenBooking}
                    className="w-full cursor-pointer rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-500 hover:text-brand-950"
                  >
                    Request appointment
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
              <Users className="mx-auto h-8 w-8 text-[var(--brand-ink)]" />
              <h3 className="mt-3 font-serif text-xl font-bold text-gray-900">
                Team profiles are being updated
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
                Contact the concierge for the current team and appointment availability.
              </p>
              <button
                onClick={() => setActiveTab?.('contact')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950"
              >
                <MessageCircle className="h-4 w-4" /> Contact concierge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
