import React, { useState } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Clock,
  UserCheck
} from 'lucide-react';
import { Therapist } from '../../types';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';

interface TherapistManagerProps {
  therapists: Therapist[];
  onRefreshTherapists: () => void;
  searchQuery: string;
}

export const TherapistManager: React.FC<TherapistManagerProps> = ({ therapists, onRefreshTherapists, searchQuery }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [specialtiesInput, setSpecialtiesInput] = useState('');
  const [rating, setRating] = useState(4.9);
  const [featured, setFeatured] = useState(true);
  const [active, setActive] = useState(true);

  const safeTherapists = therapists || [];
  const filteredTherapists = safeTherapists.filter(
    (t) =>
      t &&
      ((t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.specialties || []).some((s) => (s || '').toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleOpenAdd = () => {
    setEditingTherapist(null);
    setName('');
    setTitle('Senior Bodywork & Deep Tissue Specialist');
    setExperienceYears(6);
    setBio('Certified male therapeutic practitioner with expertise in sports recovery and muscular tension release.');
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
    setGalleryInput('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400');
    setSpecialtiesInput('Deep Tissue, Swedish, Hot Stone, Sports Massage');
    setRating(4.9);
    setFeatured(true);
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (t: Therapist) => {
    setEditingTherapist(t);
    setName(t.name);
    setTitle(t.title);
    setExperienceYears(t.experienceYears);
    setBio(t.bio);
    setPhotoUrl(t.photoUrl || t.imageUrl);
    setGalleryInput((t.gallery || []).join(', '));
    setSpecialtiesInput(t.specialties.join(', '));
    setRating(t.rating);
    setFeatured(t.featured || false);
    setActive(t.active);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const specialties = specialtiesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const gallery = galleryInput.split(',').map((g) => g.trim()).filter(Boolean);

    const payload = {
      name,
      title,
      experienceYears: Number(experienceYears),
      bio,
      imageUrl: photoUrl,
      photoUrl,
      gallery,
      specialties,
      rating: Number(rating),
      featured,
      active,
      availability: editingTherapist?.availability || {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timeSlots: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'],
      },
    };

    try {
      if (editingTherapist) {
        await api.updateTherapist(editingTherapist.id, payload);
      } else {
        await api.createTherapist(payload as any);
      }
      setShowModal(false);
      onRefreshTherapists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this therapist profile?')) return;
    try {
      await api.deleteTherapist(id);
      onRefreshTherapists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Therapists & Male Models Directory</h2>
          <p className="text-xs text-gray-500">Manage licensed therapists, specialized skills, gallery profiles, and availability.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#2CB5A0]/20"
        >
          <Plus className="w-4 h-4" /> Add New Therapist
        </button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapists.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Photo & Badge Overlay */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={t.photoUrl || t.imageUrl}
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {t.featured && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black shadow-md">
                      Featured
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      t.active ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {t.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {t.rating} ({t.reviewCount} reviews)
                </div>
              </div>

              {/* Details Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">{t.name}</h3>
                  <p className="text-xs text-[#2CB5A0] font-semibold">{t.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{t.experienceYears} Years Licensed Experience</p>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{t.bio}</p>

                {/* Specialties Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#2CB5A0] font-semibold text-[10px] border border-teal-100"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500">
                {t.availability?.workingDays?.length || 6} Days/Wk Shift
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="Delete Profile"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Therapist Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTherapist ? `Edit Profile: ${editingTherapist.name}` : 'Create Therapist Profile'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#2CB5A0]"
                placeholder="e.g. Julian Rivera"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Title / Designation</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#2CB5A0]"
                placeholder="e.g. Master Deep Tissue Specialist"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                required
                min={1}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Initial Rating</label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Profile Photo URL</label>
            <input
              type="url"
              required
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Gallery Image URLs (Comma separated)</label>
            <input
              type="text"
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none"
              placeholder="https://image1.jpg, https://image2.jpg"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Specialties (Comma separated)</label>
            <input
              type="text"
              required
              value={specialtiesInput}
              onChange={(e) => setSpecialtiesInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none"
              placeholder="Deep Tissue, Swedish Relaxation, Sports Recovery"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Bio Description</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-[#2CB5A0]"
            ></textarea>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#2CB5A0] rounded-md"
              />
              Show on Homepage (Featured)
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-[#2CB5A0] rounded-md"
              />
              Active Practitioner Status
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
              className="px-6 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold cursor-pointer shadow-md shadow-[#2CB5A0]/20"
            >
              Save Therapist Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
