import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Eye, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';

export const AdminBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const b = await api.getBlogs();
        if (Array.isArray(b)) setBlogs(b);
      } catch (err) {
        // keep empty state
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await api.deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      showToast({ type: 'error', title: 'Delete Failed', message: err?.message || 'Failed to delete article.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Wellness Articles & Journal</h1>
          <p className="text-xs text-gray-500 mt-1">Manage published articles and executive health guides</p>
        </div>
        <Link
          to="/admin/blogs/add"
          className="px-4 py-2.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Compose New Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b">
              <tr>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Read Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{b.title}</td>
                  <td className="p-4 text-gray-600">{b.category}</td>
                  <td className="p-4 text-gray-600">{b.author}</td>
                  <td className="p-4 text-gray-600">{b.readTime}</td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      to={`/blog/${b.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-500 hover:text-[#2CB5A0] inline-block"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/blogs/edit/${b.id}`}
                      className="p-1.5 text-gray-500 hover:text-[#2CB5A0] inline-block"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-600 inline-block cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
