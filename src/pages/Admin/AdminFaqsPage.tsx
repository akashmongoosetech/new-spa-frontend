import React from 'react';
import { HelpCircle, Plus } from 'lucide-react';
import { mockFaqs } from '../../data/mockData';

export const AdminFaqsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">FAQ Manager</h1>
          <p className="text-xs text-gray-500 mt-1">Manage frequently asked questions displayed on the sanctuary portal</p>
        </div>
        <button className="px-4 py-2.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add New Question
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
        {mockFaqs.map((faq) => (
          <div key={faq.id} className="p-5 space-y-1">
            <h3 className="text-sm font-bold text-gray-900">{faq.question}</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFaqsPage;
