import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Users, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const ReportsView: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: string) => {
    try {
      setDownloading(type);
      await api.downloadExportReport(type as any);
    } catch (err: any) {
      alert(err?.message || 'Failed to download report.');
    } finally {
      setDownloading(null);
    }
  };

  const reportCards = [
    {
      id: 'bookings',
      title: 'Appointments & Bookings Report',
      description: 'Complete list of guest reservations, therapist assignments, date/time slots, total revenue, and payment status.',
      icon: Calendar,
      color: 'bg-teal-50 text-[#2CB5A0]',
    },
    {
      id: 'contacts',
      title: 'Client Contact Inquiries Report',
      description: 'Audit log of all web contact form messages, group inquiries, email responses, and resolution status.',
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'therapists',
      title: 'Therapists & Staff Directory Report',
      description: 'Roster of licensed male practitioners, experience ratings, reviews, specialties, and shift schedules.',
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'services',
      title: 'Therapy Services Catalogue Report',
      description: 'Breakdown of massage packages, duration, pricing tiers, included luxury items, and active availability.',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'subscribers',
      title: 'VIP Newsletter Subscribers Report',
      description: 'CSV export of all subscribed VIP client email addresses for marketing and exclusive promotion campaigns.',
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Reports & Data Exports</h2>
        <p className="text-xs text-gray-500">Download production-ready CSV data sheets and audit reports for finance, staff, and operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl ${r.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">{r.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
              </div>

              <button
                onClick={() => handleDownload(r.id)}
                disabled={downloading === r.id}
                className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#2CB5A0]" />
                {downloading === r.id ? 'Downloading...' : 'Export CSV Report'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
