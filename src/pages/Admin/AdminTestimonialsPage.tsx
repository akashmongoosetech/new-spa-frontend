import React, { useEffect, useState } from 'react';
import { Star, Plus, Trash2 } from 'lucide-react';
import { mockTestimonials } from '../../data/mockData';
import { api } from '../../services/api';

export const AdminTestimonialsPage: React.FC = () => {
  const [items, setItems] = useState(mockTestimonials as any[]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const t = await api.getTestimonials();
        if (Array.isArray(t) && t.length > 0) setItems(t);
      } catch (err) {
        // keep mock fallback
      }
    })();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    try {
      await api.createTestimonial({ name, comment, rating, role });
      const t = await api.getTestimonials();
      if (Array.isArray(t)) setItems(t);
      setName('');
      setRole('');
      setComment('');
    } catch (err: any) {
      alert(err?.message || 'Failed to add testimonial.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.deleteTestimonial(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete testimonial.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Client Reviews & Testimonials</h1>
        <p className="text-xs text-gray-500 mt-1">Review verified feedback submitted by executive patrons</p>
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#2CB5A0]" /> Add New Testimonial
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Client name"
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2CB5A0]"
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role / title (optional)"
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2CB5A0]"
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none bg-white"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <textarea
          required
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Testimonial comment..."
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2CB5A0]"
        />
        <button type="submit" className="px-4 py-2.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold cursor-pointer">
          Add Testimonial
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{t.clientName || t.name}</h3>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic font-light">"{t.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonialsPage;
