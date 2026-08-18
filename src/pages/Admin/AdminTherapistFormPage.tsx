import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AdminTherapistFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('Senior Male Specialist');
  const [exp, setExp] = useState(5);
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const therapists = await api.getTherapists();
        const existing = therapists.find((t) => t.id === id);
        if (existing) {
          setName(existing.name);
          setTitle(existing.title);
          setExp(existing.experienceYears);
          setBio(existing.bio);
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
        name,
        title,
        experience_years: exp,
        bio,
        image_url: imageUrl,
      };
      if (isEdit) {
        await api.updateTherapist(id!, data as any);
      } else {
        await api.createTherapist(data as any);
      }
      setSaved(true);
      setTimeout(() => {
        navigate('/admin/therapists');
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save therapist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/therapists"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Therapists
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Therapist' : 'Add Certified Therapist Record'}
        </h1>

        {saved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Therapist record saved successfully! Redirecting...</span>
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
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Therapist Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marcus Vance"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Title / Designation</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Deep Tissue Practitioner"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Years of Experience</label>
              <input
                type="number"
                required
                value={exp}
                onChange={(e) => setExp(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Profile Photo URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Professional Biography</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detailed background, credentials, and therapeutic philosophy..."
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/therapists')}
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
              {loading ? 'Saving...' : 'Save Therapist Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTherapistFormPage;
