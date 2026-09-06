import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Image, Tag, User, Clock, Globe, Star, ToggleLeft, ToggleRight, Loader2, FileText, Zap } from 'lucide-react';
import { api } from '../../services/api';
import { TipTapEditor } from '../../components/admin/TipTapEditor';
import { BlogPost } from '../../types';

export const AdminBlogFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Wellness & Health');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [therapistName, setTherapistName] = useState('');
  const [therapistAvatarUrl, setTherapistAvatarUrl] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Tripod Wellness Editorial');
  const [imageUrl, setImageUrl] = useState('');
  const [seoMetaTitle, setSeoMetaTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');
  const [seoKeywordsInput, setSeoKeywordsInput] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [featureOnHomePage, setFeatureOnHomePage] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Track if summary has been manually edited (to stop auto-preview)
  const summaryEditedRef = useRef(false);
  const [generatedExcerpt, setGeneratedExcerpt] = useState('');

  // Helper to generate plain text excerpt from HTML content (mirrors backend logic)
  const generateExcerptPreview = (html: string, maxLength = 200): string => {
    if (!html) return '';
    // Strip HTML tags
    const plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // Truncate at word boundary
    if (plainText.length <= maxLength) return plainText;
    const truncated = plainText.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace === -1 ? truncated.trim() : truncated.slice(0, lastSpace).trim();
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !isEdit) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, isEdit]);

  // Update generated excerpt preview when content changes (CREATE mode only, not manually edited)
  useEffect(() => {
    if (!isEdit && !summaryEditedRef.current) {
      const preview = generateExcerptPreview(content);
      setGeneratedExcerpt(preview);
    }
  }, [content, isEdit]);

  // Mark summary as manually edited when user focuses it
  const handleSummaryFocus = () => {
    summaryEditedRef.current = true;
  };

  // When user types in summary, mark as edited and clear generated excerpt
  const handleSummaryChange = (value: string) => {
    if (!summaryEditedRef.current) {
      summaryEditedRef.current = true;
      setGeneratedExcerpt('');
    }
    setSummary(value);
  };

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    (async () => {
      try {
        const blog = await api.getBlogById(id);
        if (blog) {
          setTitle(blog.title);
          setSlug(blog.slug);
          setCategory(blog.category || 'Wellness & Health');
          setTags(blog.tags || []);
          setTagsInput((blog.tags || []).join(', '));
          setTherapistName(blog.therapistName || '');
          setTherapistAvatarUrl(blog.therapistAvatarUrl || '');
          setReadingTime(blog.readTime || '');
          setSummary(blog.summary || '');
          setContent(blog.content || '');
          setAuthor(blog.author || 'Tripod Wellness Editorial');
          setImageUrl(blog.imageUrl || '');
          setSeoMetaTitle(blog.seo?.metaTitle || '');
          setSeoMetaDescription(blog.seo?.metaDescription || '');
          setSeoKeywords(blog.seo?.keywords || []);
          setSeoKeywordsInput((blog.seo?.keywords || []).join(', '));
          setStatus(blog.status === 'inactive' ? 'inactive' : 'active');
          setFeatureOnHomePage(blog.featureOnHomePage || false);
          // On EDIT, mark summary as already edited to prevent auto-preview
          summaryEditedRef.current = true;
        }
      } catch (err) {
        // keep empty form
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const newTags = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
    setTags(newTags);
  };

  const handleSeoKeywordsChange = (value: string) => {
    setSeoKeywordsInput(value);
    const newKeywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    setSeoKeywords(newKeywords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data: Partial<BlogPost> = {
        title,
        slug: slug || undefined,
        category,
        tags,
        therapistName,
        therapistAvatarUrl,
        readTime: readingTime || undefined,
        summary,
        content,
        author,
        imageUrl,
        seo: {
          metaTitle: seoMetaTitle,
          metaDescription: seoMetaDescription,
          keywords: seoKeywords,
        },
        status,
        featureOnHomePage,
      };
      if (isEdit) {
        await api.updateBlog(id!, data);
      } else {
        await api.createBlog(data);
      }
      setSaved(true);
      setTimeout(() => {
        navigate('/admin/blogs');
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Article' : 'Compose New Article'}
        </h1>

        {saved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Article saved successfully! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BLOG INFORMATION */}
          <fieldset className="space-y-6">
            <legend className="text-sm font-bold uppercase text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2CB5A0]" />
              BLOG INFORMATION
            </legend>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Article Headline <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                placeholder="e.g., Traditional Indian Wedding Food vs Modern Wedding Menus"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none font-mono text-xs"
                placeholder="auto-generated-from-title"
              />
              <p className="text-[10px] text-gray-400 mt-1">Auto-generated from title. Leave blank to auto-generate.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none bg-white"
              >
                <option value="Wellness & Health">Wellness & Health</option>
                <option value="Therapy Guide">Therapy Guide</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Executive Health">Executive Health</option>
                <option value="Sports Recovery">Sports Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Indian Wedding, Catering, Wedding Food, Event Catering"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">Comma-separated. Press Enter after each tag.</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#2CB5A0]/10 text-[#2CB5A0] text-[10px] font-medium rounded-full flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => { const newTags = [...tags]; newTags.splice(i, 1); setTags(newTags); setTagsInput(newTags.join(', ')); }} className="text-[#2CB5A0] hover:text-rose-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Therapist Name</label>
                <input
                  type="text"
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                  placeholder="e.g., Rajesh Kumar"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Therapist Avatar URL</label>
                <input
                  type="url"
                  value={therapistAvatarUrl}
                  onChange={(e) => setTherapistAvatarUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Reading Time</label>
              <input
                type="text"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                placeholder="e.g., 5 min read (auto-calculated if left empty)"
              />
            </div>
          </fieldset>

          {/* IMAGES */}
          <fieldset className="space-y-6">
            <legend className="text-sm font-bold uppercase text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
              <Image className="w-4 h-4 text-[#2CB5A0]" />
              IMAGES
            </legend>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Featured Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                placeholder="https://images.unsplash.com/..."
              />
              {imageUrl && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <img src={imageUrl} alt="Preview" className="max-h-32 rounded-lg border" />
                  <p className="text-[10px] text-gray-500 mt-1">Preview</p>
                </div>
              )}
            </div>
          </fieldset>

          {/* CONTENT */}
          <fieldset className="space-y-6">
            <legend className="text-sm font-bold uppercase text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2CB5A0]" />
              CONTENT
            </legend>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2 flex items-center gap-2">
                Short Description / Excerpt
                {!isEdit && !summaryEditedRef.current && (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Auto-generated</span>
                )}
              </label>
              <TipTapEditor
                label=""
                placeholder="Write a brief summary for the blog card and listing..."
                value={summary}
                onChange={handleSummaryChange}
                onFocus={handleSummaryFocus}
                className="min-h-[200px]"
              />
              {!isEdit && !summaryEditedRef.current && generatedExcerpt && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3.5 h-3.5 text-[#2CB5A0]" />
                    <span className="text-[10px] font-medium text-gray-600">Generated Excerpt Preview</span>
                    <span className="text-[10px] text-gray-400 ml-auto">{generatedExcerpt.length}/200 chars</span>
                  </div>
                  <p className="text-xs text-gray-500 italic line-clamp-3 whitespace-pre-wrap">{generatedExcerpt}</p>
                  <p className="text-[10px] text-gray-400 mt-2">Start typing in the editor above to override this preview.</p>
                </div>
              )}
            </div>

            <div>
              <TipTapEditor
                label="Full Article Content"
                placeholder="Write the full article content here..."
                value={content}
                onChange={setContent}
                className="min-h-[400px]"
              />
            </div>
          </fieldset>

          {/* SEO SETTINGS */}
          <fieldset className="space-y-6">
            <legend className="text-sm font-bold uppercase text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#2CB5A0]" />
              SEO SETTINGS
            </legend>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={seoMetaTitle}
                onChange={(e) => setSeoMetaTitle(e.target.value)}
                maxLength={60}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                placeholder="Leave empty to use article title"
              />
              <p className="text-[10px] text-gray-400 mt-1">Max 60 characters. {seoMetaTitle.length}/60</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Meta Description</label>
              <textarea
                rows={2}
                value={seoMetaDescription}
                onChange={(e) => setSeoMetaDescription(e.target.value)}
                maxLength={160}
                className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                placeholder="Leave empty to use article summary"
              />
              <p className="text-[10px] text-gray-400 mt-1">Max 160 characters. {seoMetaDescription.length}/160</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">SEO Keywords</label>
              <input
                type="text"
                value={seoKeywordsInput}
                onChange={(e) => handleSeoKeywordsChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
                placeholder="Indian wedding catering, wedding food menu, modern wedding catering"
              />
              <p className="text-[10px] text-gray-400 mt-1">Comma-separated keywords.</p>
              {seoKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {seoKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-medium rounded-full flex items-center gap-1">
                      {kw}
                      <button type="button" onClick={() => { const newKw = [...seoKeywords]; newKw.splice(i, 1); setSeoKeywords(newKw); setSeoKeywordsInput(newKw.join(', ')); }} className="text-gray-500 hover:text-rose-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </fieldset>

          {/* PUBLISHING */}
          <fieldset className="space-y-6">
            <legend className="text-sm font-bold uppercase text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#2CB5A0]" />
              PUBLISHING
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Inactive articles are hidden from public.</p>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featureOnHomePage}
                    onChange={(e) => setFeatureOnHomePage(e.target.checked)}
                    className="w-4 h-4 text-[#2CB5A0] border-gray-300 rounded focus:ring-[#2CB5A0]"
                  />
                  <span className="text-xs font-bold uppercase text-gray-700">Feature on Home Page</span>
                </label>
                <p className="text-[10px] text-gray-400 mt-1">Show this article in the homepage featured section.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm focus:border-[#2CB5A0] focus:outline-none"
              />
            </div>
          </fieldset>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/blogs')}
              className="px-5 py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetching}
              className="px-6 py-3 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogFormPage;
