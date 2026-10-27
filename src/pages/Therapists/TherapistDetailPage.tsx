import React from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Calendar, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { mockSettings } from '../../data/mockData';
import { SEO } from '../../components/ui/SEO';
import { clampSeoDescription, clampSeoTitle } from '../../utils/seo';
import { EntityImage } from '../../components/ui/EntityImage';
import NotFound from '../NotFound';

export const TherapistDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const context = useOutletContext<{
    therapists?: any[];
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const therapists = context.therapists ?? [];
  const settings = context.settings || mockSettings;

  const therapist = therapists.find(
    (t) => t.id === slug || t.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!therapist) {
    return <NotFound />;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans min-h-screen">
      <SEO
        title={clampSeoTitle(`${therapist.name} | ${settings.businessName}`)}
        description={clampSeoDescription(
          therapist.bio || '',
          `View this ${settings.businessName} therapist profile, including specialties and stated experience, then book a private men-to-men massage appointment in Indore.`
        )}
      />

      <Link
        to="/therapists"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--brand-ink)] mb-8 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Therapists Directory
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl sticky top-28 text-center space-y-6">
            <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-[#BFA476]/20 shadow-lg">
              <EntityImage
                src={therapist.photoUrl || therapist.imageUrl}
                alt={`${therapist.name}, massage therapist`}
                className="w-full h-full object-cover"
                placeholderClassName="w-full h-full rounded-full"
                label={therapist.name}
                loading="eager"
              />
            </div>

            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">{therapist.name}</h1>
              <p className="text-xs font-semibold text-[var(--brand-ink)] uppercase tracking-wider mt-1">
                {therapist.title}
              </p>
            </div>

            <div className="text-left text-xs text-gray-600 space-y-2.5 border-t pt-4">
              {therapist.experienceYears > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--brand-ink)]" />
                  <span>{therapist.experienceYears} years stated experience</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--brand-ink)]" />
                <span>Profile details supplied for this therapist</span>
              </div>
            </div>

            <button
              onClick={() => context.onOpenBooking?.()}
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-400 text-brand-950 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Session with {therapist.name.split(' ')[0]}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Therapist Biography</h2>
            <p className="text-gray-600 font-light leading-relaxed text-base">
              {therapist.bio}
            </p>

            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-serif font-bold text-gray-900 text-lg">Specialties & Techniques</h3>
              <div className="flex flex-wrap gap-2">
                {(therapist.specialties || []).map((spec: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-brand-500/10 text-[var(--brand-ink)] rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDetailPage;
