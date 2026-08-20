import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Star, Award, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';
import { mockSettings } from '../../data/mockData';
import { SEO } from '../../components/ui/SEO';

export const TherapistsPage: React.FC = () => {
  const context = useOutletContext<{
    therapists?: any[];
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const therapists = context.therapists ?? [];
  const settings = context.settings || mockSettings;

  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen">
      <SEO
        title={`Certified Male Therapists | ${settings.businessName}`}
        description="Meet our team of licensed, highly skilled male massage therapists specializing in executive male relaxation and sports recovery."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#2CB5A0] uppercase">Licensed Specialists</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2 mb-4">
            Our Elite Male Therapy Staff
          </h1>
          <p className="text-gray-600 font-light text-base leading-relaxed">
            Every therapist at Tripod Wellness holds advanced state certifications, background verifications, and extensive training in muscular recovery and somatic relaxation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapists.map((therapist) => (
            <div
              key={therapist.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={therapist.photoUrl || therapist.imageUrl}
                    alt={therapist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{therapist.rating} ({therapist.reviewCount})</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-900">{therapist.name}</h3>
                    <p className="text-xs font-semibold text-[#2CB5A0] uppercase tracking-wider mt-1">
                      {therapist.title} &bull; {therapist.experienceYears} Yrs Exp.
                    </p>
                  </div>

                  <p className="text-gray-600 text-xs font-light line-clamp-3 leading-relaxed">
                    {therapist.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {therapist.specialties.map((spec, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center gap-3">
                <Link
                  to={`/therapists/${therapist.id}`}
                  className="flex-1 text-center py-2.5 border border-gray-200 hover:border-[#2CB5A0] text-gray-800 hover:text-[#2CB5A0] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  View Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => context.onOpenBooking?.()}
                  className="flex-1 py-2.5 bg-[#1A1A1A] hover:bg-[#2CB5A0] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TherapistsPage;
