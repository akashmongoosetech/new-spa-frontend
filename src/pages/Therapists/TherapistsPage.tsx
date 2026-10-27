import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { mockSettings } from '../../data/mockData';
import { EntityImage } from '../../components/ui/EntityImage';

function nameSlug(name = '') {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

export const TherapistsPage: React.FC = () => {
  const context = useOutletContext<{
    therapists?: any[];
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const therapists = context.therapists ?? [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
            Our Team
          </span>
          <h1 className="mb-4 mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Male Massage Therapists
          </h1>
          <p className="text-base font-light leading-relaxed text-gray-600">
            View the therapist profiles currently published for Tripod Wellness. Profile details
            include the name, role, specialties and experience supplied for each team member.
          </p>
        </div>

        {therapists.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <EntityImage
                      src={therapist.photoUrl || therapist.imageUrl}
                      alt={`${therapist.name}, massage therapist`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholderClassName="h-full w-full"
                      label={therapist.name}
                    />
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-gray-900">{therapist.name}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-ink)]">
                        {therapist.title}
                        {therapist.experienceYears > 0
                          ? ` • ${therapist.experienceYears} years stated experience`
                          : ''}
                      </p>
                    </div>

                    <p className="line-clamp-3 text-xs font-light leading-relaxed text-gray-600">
                      {therapist.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(therapist.specialties || []).map((specialty: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-6 pt-0">
                  <Link
                    to={`/therapists/${nameSlug(therapist.name)}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-2.5 text-center text-xs font-bold text-gray-800 transition-colors hover:border-[#BFA476] hover:text-[var(--brand-ink)]"
                  >
                    View profile
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => context.onOpenBooking?.()}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-500 hover:text-brand-950"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Book appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
            <User className="mx-auto h-8 w-8 text-[var(--brand-ink)]" />
            <h2 className="mt-3 font-serif text-xl font-bold text-gray-900">
              Team profiles are being updated
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
              Contact the concierge for the current team and appointment availability.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950"
            >
              Contact concierge <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistsPage;
