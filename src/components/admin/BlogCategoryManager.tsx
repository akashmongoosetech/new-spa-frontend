import React, { useEffect, useState } from 'react';
import { Edit2, Loader2, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { BlogCategory } from '../../types';
import { showToast } from '../../utils/toastEvents';

interface BlogCategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onChanged?: () => void;
}

export const BlogCategoryManager: React.FC<BlogCategoryManagerProps> = ({ isOpen, onClose, onChanged }) => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setCategories(await api.getBlogCategories());
    } catch (err: any) {
      setError(err?.message || 'Could not load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await api.createBlogCategory({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      await load();
      onChanged?.();
      showToast({ type: 'success', title: 'Category added', message: 'The category is ready to use.' });
    } catch (err: any) {
      setError(err?.message || 'Could not create category.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category: BlogCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || '');
  };

  const saveEdit = async (category: BlogCategory) => {
    if (!editName.trim()) return;
    setSaving(true);
    setError('');
    try {
      await api.updateBlogCategory(category.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        slug: category.slug,
      });
      setEditingId(null);
      await load();
      onChanged?.();
      showToast({ type: 'success', title: 'Category updated', message: 'Existing articles were updated too.' });
    } catch (err: any) {
      setError(err?.message || 'Could not update category.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (category: BlogCategory) => {
    if (!window.confirm(`Delete the category “${category.name}”? Categories with articles cannot be deleted.`)) return;
    setSaving(true);
    setError('');
    try {
      await api.deleteBlogCategory(category.id);
      await load();
      onChanged?.();
      showToast({ type: 'success', title: 'Category deleted', message: 'The category was removed.' });
    } catch (err: any) {
      setError(err?.message || 'Could not delete category. Reassign its articles first.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage blog categories" maxWidth="2xl">
      <div className="space-y-5">
        <p className="text-xs leading-relaxed text-gray-500">
          Categories organise published articles. Renaming one updates linked articles; a category still in use cannot be deleted.
        </p>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</div>
        )}

        <form onSubmit={create} className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase text-gray-600">New category</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                placeholder="e.g. Recovery science"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase text-gray-600">Description (optional)</label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={500}
                placeholder="Short description for admins"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-brand-950 hover:bg-brand-400 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add category
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Categories</span>
            <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-ink)]">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {loading && categories.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">No categories yet. Add the first one above.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((category) => (
                <li key={category.id} className="p-4">
                  {editingId === category.id ? (
                    <div className="space-y-2">
                      <input
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        maxLength={100}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#BFA476] focus:outline-none"
                      />
                      <input
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                        maxLength={500}
                        placeholder="Description"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-[#BFA476] focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => saveEdit(category)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-[11px] font-bold text-brand-950">
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-600">
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">{category.name}</p>
                        <p className="truncate text-[11px] text-gray-500">
                          /{category.slug} · {category.count} article{category.count === 1 ? '' : 's'}
                          {category.description ? ` · ${category.description}` : ''}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button type="button" onClick={() => startEdit(category)} title="Edit category" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[var(--brand-ink)]">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => remove(category)} title="Delete category" className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BlogCategoryManager;
