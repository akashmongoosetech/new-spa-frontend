import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AdminServiceFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(150);
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState('relaxation');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const services = await api.getServices();
        const existing = services.find((s) => s.id === id);
        if (existing) {
          setTitle(existing.title);
          setPrice(existing.price);
          setDuration(existing.durationMinutes);
          setCategory(existing.category as string);
          setShortDesc(existing.shortDescription);
          setFullDesc(existing.fullDescription);
          setImageUrl(existing.imageUrl);
        }
      } catch (err) {
        // keep empty form
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        title,
        price,
        duration_minutes: duration,
        category,
        short_description: shortDesc,
        full_description: fullDesc,
        image_url: imageUrl,
      };
      if (isEdit) {
        await api.updateService(id!, data as any);
      } else {
        await api.createService(data as any);
      }
      setSaved(true);
      setTimeout(() => {
        navigate('/admin/services');
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/services"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#2CB5A0]">
          {isEdit ? 'Editing Service' : 'New Service Entry'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Service' : 'Add New Therapy Service'}
        </h1>

        {saved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Service record successfully saved! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Service Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Executive Swedish Relaxation"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none bg-white"
              >
                <option value="relaxation">Relaxation & Swedish</option>
                <option value="deep_tissue">Deep Tissue & Sports</option>
                <option value="specialized">Specialized Therapy</option>
                <option value="vip_packages">VIP Executive Package</option>
                <option value="ayurvedic">Ayurvedic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Duration (Minutes)</label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Cover Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Short Description</label>
            <textarea
              rows={3}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief summary displayed on therapy cards..."
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Full Description</label>
            <textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/services')}
              className="px-5 py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Service Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminServiceFormPage;
