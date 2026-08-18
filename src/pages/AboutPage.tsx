import React from 'react';
import { ShieldCheck, Award, Users, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { Therapist, BusinessSettings } from '../types';
import { SEO } from '../components/ui/SEO';

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
}) => {
  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen space-y-16">
      <SEO
        title="About Us & Certified Male Therapists | Aura Luxe Spa Indore"
        description="Learn about indore's premier licensed Men-to-Men massage therapy center in Bandra West. Certified male practitioners, hospital-grade hygiene, and Ayurvedic wellness."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Story Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
              Our Vision & Story
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-gray-900 leading-tight">
              indore's Premier Men-to-Men Sanctuary
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Aura Luxe was founded in Bandra West on a singular principle: modern gentlemen, executives, and fitness enthusiasts in Indore, Ujjain, Dewas deserve a dedicated, world-class wellness sanctuary tailored specifically to male physiology, postural stress, and mental decompression.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our licensed male massage practitioners undergo extensive clinical training in classical Ayurvedic Abhyanga, Kerala oil therapy, deep tissue bodywork, and athletic recovery rituals.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold text-gray-800">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#2CB5A0]" />
                <span>100% Certified Male Therapists</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <Award className="w-5 h-5 text-[#C7A36A]" />
                <span>Hospital-Grade Hygiene</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
                alt="Aura Luxe Spa Environment"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-teal-50 shadow-md space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Our Core Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#2CB5A0] text-white flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-serif font-bold text-gray-900">Executive Privacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete client anonymity, private suite reservations, and unhurried appointment spacing for total relaxation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#2CB5A0] text-white flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-serif font-bold text-gray-900">Clinical Hygiene</h3>
              <p className="text-gray-600 leading-relaxed">
                Fresh disinfected linens, private hydrotherapy showers, and sanitized equipment for every guest.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#2CB5A0] text-white flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-serif font-bold text-gray-900">Anatomical Mastery</h3>
              <p className="text-gray-600 leading-relaxed">
                Therapists trained in neuromuscular release, sports recovery, and tension alleviation.
              </p>
            </div>
          </div>
        </div>

        {/* Therapists Team */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Meet Our Certified Male Staff
            </h2>
            <p className="text-gray-600 text-xs">
              Licensed massage therapists dedicated to your comfort and health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {therapists.map((th) => (
              <div key={th.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 text-center">
                <img
                  src={th.imageUrl}
                  alt={th.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-teal-50"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{th.name}</h3>
                  <p className="text-xs text-[#2CB5A0] font-semibold mt-0.5">{th.title}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{th.experienceYears} Years Clinical Experience</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{th.bio}</p>
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 rounded-xl bg-[#1A1A1A] text-white font-bold text-xs hover:bg-[#2CB5A0] transition-colors cursor-pointer"
                >
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
