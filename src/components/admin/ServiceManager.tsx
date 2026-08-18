import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Star,
  Check,
  Tag
} from 'lucide-react';
import { Service } from '../../types';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';

interface ServiceManagerProps {
  services: Service[];
  onRefreshServices: () => void;
  searchQuery: string;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({ services, onRefreshServices, searchQuery }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Service['category']>('relaxation');
  const [price, setPrice] = useState(160);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');
  const [featured, setFeatured] = useState(true);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const safeServices = services || [];
  const filteredServices = safeServices.filter(
    (s) =>
      s &&
      ((s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.shortDescription || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle('');
    setCategory('relaxation');
    setPrice(180);
    setDurationMinutes(60);
    setShortDescription('An elite therapeutic session tailored for gentlemen muscle relief.');
    setFullDescription('Experience therapeutic excellence crafted exclusively for men in Indore, Ujjain, Dewas.');
    setImageUrl('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600');
    setBenefitsInput('Deep muscle recovery, Tension relief, Enhanced circulation, Stress mitigation');
    setIncludedInput('Hydrotherapy access, Organic aromatic oil choice, Post-session herbal elixir');
    setFeatured(true);
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setTitle(s.title);
    setCategory(s.category);
    setPrice(s.price);
    setDurationMinutes(s.durationMinutes);
    setShortDescription(s.shortDescription);
    setFullDescription(s.fullDescription);
    setImageUrl(s.imageUrl);
    setBenefitsInput((s.benefits || []).join(', '));
    setIncludedInput((s.includedItems || []).join(', '));
    setFeatured(s.featured);
    setActive(s.active);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const benefits = benefitsInput.split(',').map((b) => b.trim()).filter(Boolean);
    const includedItems = includedInput.split(',').map((i) => i.trim()).filter(Boolean);

    const payload = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      shortDescription,
      fullDescription,
      imageUrl,
      benefits,
      includedItems,
      featured,
      active,
      rating: editingService?.rating || 4.9,
      reviewsCount: editingService?.reviewsCount || 28,
    };

    try {
      setSaving(true);
      if (editingService) {
        await api.updateService(editingService.id, payload);
      } else {
        await api.createService(payload as any);
      }
      setShowModal(false);
      onRefreshServices();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      onRefreshServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Therapy Services Catalogue</h2>
          <p className="text-xs text-gray-500">Configure signature massage packages, duration options, pricing, and benefits.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#2CB5A0]/20"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Services List Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          No services match your search. Try a different query or add a new service.
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={s.imageUrl}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/80 backdrop-blur-md text-white">
                    {s.category}
                  </span>
                  {s.featured && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-black">
                      Featured
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#2CB5A0] text-black font-extrabold text-sm shadow-md">
                  ₹{s.price}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-gray-900 text-base">{s.title}</h3>
                  <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#2CB5A0]" /> {s.durationMinutes} m
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{s.shortDescription}</p>

                {/* Included Items */}
                <div className="space-y-1 pt-1">
                  {(s.includedItems || []).slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-gray-600">
                      <Check className="w-3 h-3 text-[#2CB5A0] shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s.active ? 'Available' : 'Disabled'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingService ? `Edit Service: ${editingService.title}` : 'Add New Therapy Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Service Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#2CB5A0]"
              placeholder="e.g. Royal Swedish Relaxation Massage"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="service-category" className="block font-bold text-gray-700 mb-1">Category</label>
              <select
                id="service-category"
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border font-semibold outline-none"
              >
                <option value="relaxation">Relaxation</option>
                <option value="deep_tissue">Deep Tissue</option>
                <option value="hot_stone">Hot Stone</option>
                <option value="vip_packages">VIP Packages</option>
              </select>
            </div>
            <div>
              <label htmlFor="service-price" className="block font-bold text-gray-700 mb-1">Price (₹ INR)</label>
              <input
                id="service-price"
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none"
              />
            </div>
            <div>
              <label htmlFor="service-duration" className="block font-bold text-gray-700 mb-1">Duration (Minutes)</label>
              <input
                id="service-duration"
                type="number"
                required
                min={15}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Short Description</label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Full Description</label>
            <textarea
              rows={3}
              required
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-[#2CB5A0]"
            ></textarea>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Image Banner URL</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Included Experience Items (Comma separated)</label>
            <input
              type="text"
              value={includedInput}
              onChange={(e) => setIncludedInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
              placeholder="Shower Suite Access, Organic Essential Oils, Herbal Elixir"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#2CB5A0] rounded-md"
              />
              Show as Featured Service
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-[#2CB5A0] rounded-md"
              />
              Active Service Status
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2.5 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold cursor-pointer shadow-md shadow-[#2CB5A0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
