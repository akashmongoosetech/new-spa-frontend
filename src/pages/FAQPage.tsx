import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQ, BusinessSettings } from '../types';
import { SEO } from '../components/ui/SEO';

interface FAQPageProps {
  faqs?: FAQ[];
  settings?: BusinessSettings;
  onOpenBooking?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ faqs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['all', 'general', 'booking', 'services', 'safety'];

  const safeFaqs = faqs || [];
  const filteredFaqs = safeFaqs.filter(f => {
    if (!f) return false;
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesQuery = (f.question || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (f.answer || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen">
      <SEO title="Frequently Asked Questions | Aura Luxe Spa" description="Find answers regarding our Men-to-Men massage therapies, therapist certifications, booking process, and hygiene standards." />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Help Center
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-gray-600">
            Clear, transparent answers regarding our male therapists, appointment policies, and spa etiquette.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type your question e.g., cancellation, showers, male therapists..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#2CB5A0] shadow-sm bg-white"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex justify-center gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer uppercase tracking-wider ${
                selectedCategory === c ? 'bg-[#2CB5A0] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.id} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-gray-900 text-sm flex justify-between items-center gap-4 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#2CB5A0] shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#2CB5A0]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
