import React, { useEffect, useRef, useState } from 'react';
import { Image, Upload, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('suites');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const g = await api.getGallery();
        if (Array.isArray(g)) setItems(g);
      } catch (err) {
        // ignore — empty state
      }
    })();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      setImageUrl(res.url);
    } catch (err: any) {
      alert(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;
    try {
      await api.createGalleryItem({ title, category, imageUrl });
      const g = await api.getGallery();
      if (Array.isArray(g)) setItems(g);
      setTitle('');
      setImageUrl('');
    } catch (err: any) {
      alert(err?.message || 'Failed to add gallery item.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await api.deleteGalleryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete gallery item.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Sanctuary Gallery Manager</h1>
          <p className="text-xs text-gray-500 mt-1">Manage high-resolution imagery showcasing private suites and facilities</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload New Image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Item title"
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2CB5A0]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none bg-white"
        >
          <option value="suites">VIP Suites</option>
          <option value="equipment">Equipment</option>
          <option value="ambiance">Ambiance</option>
          <option value="hydrotherapy">Hydrotherapy</option>
        </select>
        <input
          type="text"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (or upload)"
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2CB5A0]"
        />
        <button type="submit" className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer">
          Add Item
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400 text-xs flex flex-col items-center gap-2">
            <Image className="w-8 h-8" />
            <span>No gallery items yet. Upload images or add by URL.</span>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gray-200 aspect-square shadow-sm">
              <img src={item.image_url || item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] font-bold px-2 py-1 truncate">
                {item.title}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminGalleryPage;
