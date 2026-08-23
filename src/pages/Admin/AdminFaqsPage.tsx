import React, { useEffect, useState } from 'react';
import { HelpCircle, Plus, Trash2, X, CheckCircle2, Eye, EyeOff, Edit2, Save, RotateCcw } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: number;
  isPublished: number;
}

export const AdminFaqsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const f = await api.getFaqs('all');
      if (Array.isArray(f)) setFaqs(f);
    } catch (err) {
      // keep empty state
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      const created = await api.createFaq({ question: question.trim(), answer: answer.trim(), category });
      setFaqs((prev) => [...prev, created]);
      setQuestion('');
      setAnswer('');
      setCategory('general');
      setShowAddModal(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      showToast({ type: 'error', title: 'Add Failed', message: err?.message || 'Failed to add FAQ.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !editingId) return;
    setSaving(true);
    try {
      const updated = await api.updateFaq(editingId, { question: question.trim(), answer: answer.trim(), category });
      setFaqs((prev) => prev.map((f) => (f.id === editingId ? updated : f)));
      setQuestion('');
      setAnswer('');
      setCategory('general');
      setEditingId(null);
      setShowEditModal(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update Failed', message: err?.message || 'Failed to update FAQ.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this FAQ entry?')) return;
    try {
      await api.deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      showToast({ type: 'error', title: 'Delete Failed', message: err?.message || 'Failed to delete FAQ.' });
    }
  };

  const handleTogglePublished = async (id: string, currentPublished: number) => {
    if (toggling === id) return;
    setToggling(id);
    try {
      const updated = await api.toggleFaqStatus(id);
      setFaqs((prev) => prev.map((f) => (f.id === id ? updated : f)));
      showToast({ type: 'success', title: 'Updated', message: `FAQ ${updated.isPublished ? 'published' : 'unpublished'}` });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Toggle Failed', message: err?.message || 'Failed to toggle publish status.' });
    } finally {
      setToggling(null);
    }
  };

  const openEditModal = (faq: FaqItem) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'general');
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">FAQ Manager</h1>
          <p className="text-xs text-gray-500 mt-1">Manage frequently asked questions displayed on the sanctuary portal</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setQuestion(''); setAnswer(''); setCategory('general'); setShowAddModal(true); }}
          className="px-4 py-2.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Question
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>FAQ saved successfully.</span>
        </div>
      )}

      {faqs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-sm text-gray-400">
          No FAQs yet. Add your first question using the button above.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-5 flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2CB5A0]/10 text-[#2CB5A0]">
                    {faq.category || 'general'}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    faq.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {faq.isPublished ? 'Published' : 'Hidden'}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#2CB5A0] shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                </div>
                <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePublished(faq.id, faq.isPublished)}
                  disabled={toggling === faq.id}
                  className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    faq.isPublished
                      ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                  }`}
                  title={faq.isPublished ? 'Unpublish' : 'Publish'}
                  aria-label={faq.isPublished ? `Unpublish: ${faq.question}` : `Publish: ${faq.question}`}
                >
                  {toggling === faq.id ? (
                    <RotateCcw className="w-4 h-4 animate-spin" />
                  ) : faq.isPublished ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(faq)}
                  className="p-2 rounded-lg text-gray-300 hover:text-[#2CB5A0] hover:bg-[#2CB5A0]/10 transition-colors cursor-pointer shrink-0"
                  title="Edit FAQ"
                  aria-label={`Edit FAQ: ${faq.question}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Delete FAQ"
                  aria-label={`Delete FAQ: ${faq.question}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => { setShowAddModal(false); setShowEditModal(false); setEditingId(null); setQuestion(''); setAnswer(''); setCategory('general'); }}
        title={showEditModal ? 'Edit Question' : 'Add New Question'}
        size="md"
      >
        <form onSubmit={showEditModal ? handleEdit : handleAdd} className="space-y-4 text-xs">
          <div>
            <label htmlFor="faq-question" className="block font-bold text-gray-700 mb-1.5">
              Question
            </label>
            <input
              id="faq-question"
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#2CB5A0]"
              placeholder="e.g. Do you offer couples massage sessions?"
            />
          </div>
          <div>
            <label htmlFor="faq-answer" className="block font-bold text-gray-700 mb-1.5">
              Answer
            </label>
            <textarea
              id="faq-answer"
              rows={4}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-[#2CB5A0]"
              placeholder="Write the answer shown to visitors..."
            />
          </div>
          <div>
            <label htmlFor="faq-category" className="block font-bold text-gray-700 mb-1.5">
              Category
            </label>
            <select
              id="faq-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#2CB5A0]"
            >
              <option value="general">General</option>
              <option value="booking">Booking & Appointments</option>
              <option value="services">Therapy Services</option>
              <option value="safety">Hygiene & Safety</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingId(null); setQuestion(''); setAnswer(''); setCategory('general'); }}
              className="px-4 py-2.5 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-[#259b89] text-white font-bold cursor-pointer shadow-md shadow-[#2CB5A0]/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : showEditModal ? 'Save Changes' : 'Add Question'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFaqsPage;