import React, { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Image as ImageIcon,
  Loader2,
  Save,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Star,
  Tag,
  User,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { TipTapEditor } from '../../components/admin/TipTapEditor';
import { BlogSectionsEditor } from '../../components/admin/BlogSectionsEditor';
import { BlogCategoryManager } from '../../components/admin/BlogCategoryManager';
import { Modal } from '../../components/ui/Modal';
import { BlogCategory, BlogPost, BlogSection, BlogStatus } from '../../types';
import { SITE_NAME, SITE_URL } from '../../config/site';
import { showToast } from '../../utils/toastEvents';

interface BlogFormState {
  title: string;
  slug: string;
  category: string;
  categoryId: string;
  tags: string[];
  author: string;
  therapistName: string;
  therapistAvatarUrl: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  status: BlogStatus;
  isFeatured: boolean;
  sections: BlogSection[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImageUrl: string;
    keywords: string[];
  };
}

const EMPTY_FORM: BlogFormState = {
  title: '',
  slug: '',
  category: '',
  categoryId: '',
  tags: [],
  author: '',
  therapistName: '',
  therapistAvatarUrl: '',
  excerpt: '',
  content: '',
  featuredImageUrl: '',
  featuredImageAlt: '',
  status: 'draft',
  isFeatured: false,
  sections: [],
  seo: {
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImageUrl: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImageUrl: '',
    keywords: [],
  },
};

function plainText(html: string) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,noscript').forEach((node) => node.remove());
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160);
}

function readingTimeFor(content: string, sections: BlogSection[]) {
  const words = [content, ...sections.map((section) => section.content)]
    .map(plainText)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function formatDate(value?: string) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return value;
  }
}

function isSafeUrl(value: string): boolean {
  const raw = value.trim();
  return !raw || /^(https:\/\/|\/(?!\/))/i.test(raw);
}

const FieldError: React.FC<{ children?: React.ReactNode }> = ({ children }) =>
  children ? <p className="mt-1 text-[11px] font-medium text-rose-600">{children}</p> : null;

export const AdminBlogFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<BlogFormState>(EMPTY_FORM);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [fetching, setFetching] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [persistedStatus, setPersistedStatus] = useState<BlogStatus>('draft');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const loadCategories = async () => {
    try {
      const list = await api.getBlogCategories();
      setCategories(list);
      setForm((current) => {
        if (current.categoryId) return current;
        const match = list.find((category) => category.name.toLowerCase() === current.category.toLowerCase());
        return match ? { ...current, categoryId: match.id, category: match.name } : current;
      });
    } catch {
      // Category loading failure is shown only when the admin attempts to use
      // the category controls; the form itself can still be completed.
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setFetching(true);
    (async () => {
      try {
        const post = await api.getBlogById(id);
        if (cancelled) return;
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          category: post.category || '',
          categoryId: post.categoryId || '',
          tags: post.tags || [],
          author: post.author || '',
          therapistName: post.therapistName || '',
          therapistAvatarUrl: post.therapistAvatarUrl || '',
          excerpt: post.summary || '',
          content: post.content || '',
          featuredImageUrl: post.featuredImageUrl || post.imageUrl || '',
          featuredImageAlt: post.featuredImageAlt || '',
          status: post.status || 'draft',
          isFeatured: Boolean(post.isFeatured || post.featureOnHomePage),
          sections: post.sections || [],
          seo: {
            metaTitle: post.seo?.metaTitle || '',
            metaDescription: post.seo?.metaDescription || '',
            canonicalUrl: post.seo?.canonicalUrl || '',
            ogTitle: post.seo?.ogTitle || '',
            ogDescription: post.seo?.ogDescription || '',
            ogImageUrl: post.seo?.ogImageUrl || '',
            twitterTitle: post.seo?.twitterTitle || '',
            twitterDescription: post.seo?.twitterDescription || '',
            twitterImageUrl: post.seo?.twitterImageUrl || '',
            keywords: post.seo?.keywords || [],
          },
        });
        setTagsInput((post.tags || []).join(', '));
        setKeywordsInput((post.seo?.keywords || []).join(', '));
        setUpdatedAt(post.updatedAt);
        setPersistedStatus(post.status || 'draft');
        setSlugTouched(true);
      } catch (err: any) {
        setError(err?.message || 'Could not load this article.');
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (isEdit || slugTouched || !form.title) return;
    setForm((current) => ({ ...current, slug: slugify(current.title) }));
  }, [form.title, isEdit, slugTouched]);

  const setField = <K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const setSeo = <K extends keyof BlogFormState['seo']>(key: K, value: BlogFormState['seo'][K]) => {
    setForm((current) => ({ ...current, seo: { ...current.seo, [key]: value } }));
    setSaved(false);
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = Array.from(new Set(value.split(',').map((tag) => tag.trim()).filter(Boolean))).slice(0, 30);
    setField('tags', tags);
  };

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
    const keywords = Array.from(new Set(value.split(',').map((keyword) => keyword.trim()).filter(Boolean))).slice(0, 30);
    setSeo('keywords', keywords);
  };

  const autoExcerpt = useMemo(() => {
    if (plainText(form.excerpt)) return '';
    const text = [plainText(form.content), ...form.sections.map((section) => plainText(section.content))].join(' ').trim();
    return text.slice(0, 200);
  }, [form.content, form.excerpt, form.sections]);

  const computedReadingTime = useMemo(
    () => readingTimeFor(form.content, form.sections),
    [form.content, form.sections]
  );

  const canonicalPreview = form.seo.canonicalUrl || `${SITE_URL}/blog/${form.slug || 'article-slug'}/`;
  const metaTitlePreview = form.seo.metaTitle || form.title || 'Article title';
  const metaDescriptionPreview = form.seo.metaDescription || plainText(form.excerpt) || autoExcerpt || plainText(form.content).slice(0, 160);
  const socialTitlePreview = form.seo.ogTitle || metaTitlePreview;
  const socialDescriptionPreview = form.seo.ogDescription || metaDescriptionPreview;
  const socialImagePreview = form.seo.ogImageUrl || form.featuredImageUrl || `${SITE_URL}/brand/og-default.jpg`;
  const previewExcerpt = form.excerpt || (autoExcerpt ? `<p>${autoExcerpt.replace(/[<>&]/g, '')}</p>` : '');

  const validate = (status: BlogStatus) => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Add a title.';
    if (status === 'published' && !plainText(form.content)) next.content = 'Add the main article content before publishing.';
    if (form.featuredImageUrl && !isSafeUrl(form.featuredImageUrl)) next.featuredImageUrl = 'Use an HTTPS image URL or a site path beginning with /.';
    if (form.featuredImageUrl && !form.featuredImageAlt.trim()) next.featuredImageAlt = 'Describe the featured image for accessibility.';
    if (form.seo.canonicalUrl && !/^https:\/\//i.test(form.seo.canonicalUrl)) next.canonicalUrl = 'Canonical URL must be an HTTPS URL on the site domain.';
    if (form.slug && slugify(form.slug) !== form.slug) next.slug = 'Use lowercase letters, numbers and hyphens only.';
    if (status === 'published' && !form.category.trim()) next.category = 'Choose a category before publishing.';
    if (status === 'published' && form.isFeatured && !form.featuredImageUrl) next.featuredImageUrl = 'Featured posts need a featured image.';
    if (form.seo.metaTitle.length > 60) next.metaTitle = 'Meta title must be 60 characters or fewer.';
    if (form.seo.metaDescription.length > 160) next.metaDescription = 'Meta description must be 160 characters or fewer.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (status: BlogStatus) => {
    setError('');
    setSaved(false);
    if (isEdit && persistedStatus === 'published' && status !== 'published') {
      const message = status === 'draft'
        ? 'Save this published article as a draft? It will be removed from the public site, sitemap and related posts.'
        : 'Unpublish this article? It will be removed from the public site, sitemap and related posts.';
      if (!window.confirm(message)) return;
    }
    if (!validate(status)) {
      setError('Please correct the highlighted fields before saving.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(true);
    try {
      const payload: Partial<BlogPost> = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        category: form.category.trim(),
        categoryId: form.categoryId || undefined,
        author: form.author.trim(),
        therapistName: form.therapistName.trim(),
        therapistAvatarUrl: form.therapistAvatarUrl.trim(),
        summary: form.excerpt,
        content: form.content,
        featuredImageUrl: form.featuredImageUrl.trim(),
        featuredImageAlt: form.featuredImageAlt.trim(),
        tags: form.tags,
        status,
        isFeatured: form.isFeatured,
        sections: form.sections,
        seo: form.seo,
        updatedAt,
      };
      const result = isEdit && id ? await api.updateBlog(id, payload) : await api.createBlog(payload);
      setUpdatedAt(result.updatedAt);
      setPersistedStatus(result.status || status);
      setForm((current) => ({
        ...current,
        slug: result.slug || current.slug,
        status: result.status || status,
        category: result.category || '',
        categoryId: result.categoryId || '',
        isFeatured: Boolean(result.isFeatured),
        featuredImageUrl: result.featuredImageUrl || '',
        featuredImageAlt: result.featuredImageAlt || '',
      }));
      setSaved(true);
      showToast({
        type: 'success',
        title: status === 'published' ? 'Article published' : 'Article saved',
        message: status === 'published'
          ? 'The public article and sitemap will update shortly.'
          : 'Changes saved. The article is not public unless its status is published.',
      });
      if (!isEdit) navigate(`/admin/blogs/edit/${result.id}`, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Could not save the article.');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center">
        <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-[var(--brand-ink)]" />
        <p className="text-sm text-gray-500">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/blogs" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to articles
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-[#BFA476]">
            <Eye className="h-4 w-4" /> Preview
          </button>
          {isEdit && form.status === 'published' && (
            <a
              href={`/blog/${form.slug}/`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-[#BFA476]"
            >
              <Globe className="h-4 w-4" /> View live
            </a>
          )}
          <button type="button" onClick={() => submit('draft')} disabled={saving} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save draft
          </button>
          {isEdit && form.status === 'published' && (
            <button type="button" onClick={() => submit('unpublished')} disabled={saving} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">
              Unpublish
            </button>
          )}
          <button type="button" onClick={() => submit('published')} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-brand-950 shadow-sm hover:bg-brand-400 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {form.status === 'published' ? 'Save changes' : 'Publish'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Saved. {form.status !== 'published' ? 'This article is not live.' : 'Published changes will appear shortly.'}
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileTextIcon />
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Article</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Title <span className="text-rose-500">*</span></label>
                <input
                  value={form.title}
                  maxLength={500}
                  disabled={saving}
                  onChange={(event) => setField('title', event.target.value)}
                  placeholder="A useful, specific article title"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg font-semibold focus:border-[#BFA476] focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
                />
                <FieldError>{errors.title}</FieldError>
                <p className="mt-1 text-right text-[10px] text-gray-400">{form.title.length}/500</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Category</label>
                  <div className="flex gap-2">
                    <select
                      value={form.categoryId || (form.category ? `name:${form.category}` : '')}
                      disabled={saving}
                      onChange={(event) => {
                        const value = event.target.value;
                        const category = categories.find((item) => item.id === value);
                        if (category) setForm((current) => ({ ...current, categoryId: category.id, category: category.name }));
                        else if (value.startsWith('name:')) setForm((current) => ({ ...current, categoryId: '', category: value.slice(5) }));
                        else setForm((current) => ({ ...current, categoryId: '', category: '' }));
                        setSaved(false);
                      }}
                      className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none"
                    >
                      <option value="">Choose a category</option>
                      {form.category && !categories.some((category) => category.name === form.category) && (
                        <option value={`name:${form.category}`}>{form.category}</option>
                      )}
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name} ({category.count})</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setCategoryManagerOpen(true)} title="Manage categories" className="shrink-0 rounded-xl border border-gray-300 px-3 text-gray-600 hover:border-[#BFA476]">
                      <Settings2 className="h-4 w-4" />
                    </button>
                  </div>
                  <FieldError>{errors.category}</FieldError>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Slug</label>
                  <input
                    value={form.slug}
                    maxLength={160}
                    disabled={saving}
                    onChange={(event) => {
                      setSlugTouched(true);
                      setField('slug', slugify(event.target.value));
                    }}
                    placeholder="auto-generated-from-title"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 font-mono text-xs focus:border-[#BFA476] focus:outline-none"
                  />
                  <FieldError>{errors.slug}</FieldError>
                  <p className="mt-1 truncate text-[10px] text-gray-400">/blog/{form.slug || 'auto-generated'}/</p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Excerpt / card summary</label>
                <TipTapEditor
                  value={form.excerpt}
                  onChange={(value) => setField('excerpt', value)}
                  placeholder="A short summary shown on cards and as the SEO description fallback."
                  disabled={saving}
                  minHeight="150px"
                  compact
                />
                {!plainText(form.excerpt) && autoExcerpt && (
                  <div className="mt-2 rounded-xl border border-dashed border-brand-200 bg-brand-50/60 p-3 text-xs text-gray-600">
                    <div className="mb-1 flex items-center gap-1.5 font-semibold text-[var(--brand-ink)]"><ZapIcon /> Auto fallback preview</div>
                    <p className="leading-relaxed">{autoExcerpt}{autoExcerpt.length >= 200 ? '…' : ''}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase text-gray-700">
                  Main content <span className="text-rose-500">*</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium normal-case text-gray-400"><Clock className="h-3 w-3" /> about {computedReadingTime} min read</span>
                </label>
                <TipTapEditor
                  value={form.content}
                  onChange={(value) => setField('content', value)}
                  placeholder="Write the article..."
                  disabled={saving}
                  minHeight="420px"
                />
                <FieldError>{errors.content}</FieldError>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <BlogSectionsEditor
              sections={form.sections}
              onChange={(sections) => setField('sections', sections)}
              disabled={saving}
            />
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Search className="h-4 w-4 text-[var(--brand-ink)]" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Search & sharing</h2>
            </div>
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Meta title</label>
                  <input
                    value={form.seo.metaTitle}
                    maxLength={60}
                    disabled={saving}
                    onChange={(event) => setSeo('metaTitle', event.target.value)}
                    placeholder="Falls back to the article title"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none"
                  />
                  <FieldError>{errors.metaTitle}</FieldError>
                  <p className="mt-1 text-right text-[10px] text-gray-400">{form.seo.metaTitle.length}/60</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Canonical URL</label>
                  <input
                    value={form.seo.canonicalUrl}
                    disabled={saving}
                    onChange={(event) => setSeo('canonicalUrl', event.target.value)}
                    placeholder={canonicalPreview}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none"
                  />
                  <FieldError>{errors.canonicalUrl}</FieldError>
                  <p className="mt-1 text-[10px] text-gray-400">Leave blank for the site canonical (trailing slash).</p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Meta description</label>
                <textarea
                  value={form.seo.metaDescription}
                  maxLength={160}
                  rows={3}
                  disabled={saving}
                  onChange={(event) => setSeo('metaDescription', event.target.value)}
                  placeholder="Falls back to the excerpt, then the article text."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none"
                />
                <FieldError>{errors.metaDescription}</FieldError>
                <p className="mt-1 text-right text-[10px] text-gray-400">{form.seo.metaDescription.length}/160</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">SEO keywords</label>
                <input
                  value={keywordsInput}
                  disabled={saving}
                  onChange={(event) => handleKeywordsChange(event.target.value)}
                  placeholder="massage therapy Indore, sports recovery, stress relief"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-gray-400">Comma-separated. These are hints, not a ranking guarantee.</p>
                {form.seo.keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.seo.keywords.map((keyword) => (
                      <span key={keyword} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        {keyword}
                        <button type="button" onClick={() => handleKeywordsChange(form.seo.keywords.filter((item) => item !== keyword).join(', '))} className="text-gray-400 hover:text-rose-500"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase text-gray-700"><Share2 className="h-3.5 w-3.5" /> Open Graph title</label>
                  <input value={form.seo.ogTitle} maxLength={70} disabled={saving} onChange={(event) => setSeo('ogTitle', event.target.value)} placeholder={metaTitlePreview} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase text-gray-700"><Share2 className="h-3.5 w-3.5" /> Twitter/X title</label>
                  <input value={form.seo.twitterTitle} maxLength={70} disabled={saving} onChange={(event) => setSeo('twitterTitle', event.target.value)} placeholder={socialTitlePreview} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Open Graph description</label>
                  <textarea value={form.seo.ogDescription} maxLength={200} rows={2} disabled={saving} onChange={(event) => setSeo('ogDescription', event.target.value)} placeholder={metaDescriptionPreview} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Twitter/X description</label>
                  <textarea value={form.seo.twitterDescription} maxLength={200} rows={2} disabled={saving} onChange={(event) => setSeo('twitterDescription', event.target.value)} placeholder={socialDescriptionPreview} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Open Graph image URL</label>
                  <input value={form.seo.ogImageUrl} disabled={saving} onChange={(event) => setSeo('ogImageUrl', event.target.value)} placeholder="Falls back to the featured image" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Twitter/X image URL</label>
                  <input value={form.seo.twitterImageUrl} disabled={saving} onChange={(event) => setSeo('twitterImageUrl', event.target.value)} placeholder="Falls back to the Open Graph image" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none" />
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400"><Search className="h-3 w-3" /> Search preview</div>
                  <p className="truncate text-[11px] text-gray-500">{canonicalPreview}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-blue-700">{metaTitlePreview}</p>
                  <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-gray-600">{metaDescriptionPreview || 'Add a description to see the search preview.'}</p>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400"><Share2 className="h-3 w-3" /> Social preview</div>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {socialImagePreview && <img src={socialImagePreview} alt="" className="h-24 w-full object-cover" />}
                    <div className="p-2.5">
                      <p className="text-[9px] uppercase tracking-wide text-gray-400">{SITE_NAME}</p>
                      <p className="truncate text-xs font-semibold text-gray-800">{socialTitlePreview}</p>
                      <p className="line-clamp-2 text-[10px] text-gray-500">{socialDescriptionPreview}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"><Globe className="h-4 w-4 text-[var(--brand-ink)]" /> Publishing</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Status</label>
                <div className={`rounded-xl border px-3 py-2.5 text-sm font-bold ${
                  form.status === 'published'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : form.status === 'unpublished'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}>
                  {form.status === 'published' ? 'Published' : form.status === 'unpublished' ? 'Unpublished' : 'Draft'}
                </div>
                <p className="mt-1 text-[10px] text-gray-400">Use Save draft, Publish or Unpublish to change the public state. Draft and unpublished articles never appear publicly.</p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                <div>
                  <p className="text-xs font-bold text-gray-700">Featured</p>
                  <p className="text-[10px] text-gray-400">Show in featured areas</p>
                </div>
                <input type="checkbox" checked={form.isFeatured} disabled={saving} onChange={(event) => setField('isFeatured', event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[var(--brand-ink)] focus:ring-[#BFA476]" />
              </div>

              {updatedAt && (
                <p className="flex items-center gap-1.5 text-[10px] text-gray-400"><Calendar className="h-3 w-3" /> Last saved {formatDate(updatedAt)}</p>
              )}
              {form.status === 'published' && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-[11px] leading-relaxed text-emerald-800">
                  Public URL: <span className="break-all font-mono">/blog/{form.slug || 'slug'}/</span>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"><ImageIcon className="h-4 w-4 text-[var(--brand-ink)]" /> Featured image</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Image URL</label>
                <input
                  value={form.featuredImageUrl}
                  disabled={saving}
                  onChange={(event) => setField('featuredImageUrl', event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none"
                />
                <FieldError>{errors.featuredImageUrl}</FieldError>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Alt text <span className="text-rose-500">*</span></label>
                <input
                  value={form.featuredImageAlt}
                  maxLength={300}
                  disabled={saving}
                  onChange={(event) => setField('featuredImageAlt', event.target.value)}
                  placeholder="Describe what the image shows"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none"
                />
                <FieldError>{errors.featuredImageAlt}</FieldError>
              </div>
              {form.featuredImageUrl ? (
                <img src={form.featuredImageUrl} alt={form.featuredImageAlt || ''} className="h-36 w-full rounded-xl object-cover" />
              ) : (
                <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-[11px] text-gray-400">No image selected</div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700"><User className="h-4 w-4 text-[var(--brand-ink)]" /> Byline & tags</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Author</label>
                <input value={form.author} disabled={saving} onChange={(event) => setField('author', event.target.value)} placeholder="Only enter a real, approved author" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none" />
                <p className="mt-1 text-[10px] text-gray-400">Leave blank if there is no named author.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Therapist (optional)</label>
                  <input value={form.therapistName} disabled={saving} onChange={(event) => setField('therapistName', event.target.value)} placeholder="Only approved therapist name" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">Therapist avatar URL</label>
                  <input value={form.therapistAvatarUrl} disabled={saving} onChange={(event) => setField('therapistAvatarUrl', event.target.value)} placeholder="https://..." className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase text-gray-700"><Tag className="h-3.5 w-3.5" /> Tags</label>
                <input value={tagsInput} disabled={saving} onChange={(event) => handleTagsChange(event.target.value)} placeholder="Recovery, Stress, Indore" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none" />
                {form.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-[var(--brand-ink)]">
                        {tag}
                        <button type="button" onClick={() => handleTagsChange(form.tags.filter((item) => item !== tag).join(', '))} className="text-[var(--brand-ink)] hover:text-rose-500"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 text-[11px] leading-relaxed text-gray-600">
            <p className="mb-1 flex items-center gap-1.5 font-bold text-[var(--brand-ink)]"><Star className="h-3.5 w-3.5" /> Publishing checklist</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Only publish verified, non-medical-misleading content.</li>
              <li>Every image needs meaningful alt text.</li>
              <li>Drafts are hidden from the public site, search, related posts and sitemap.</li>
              <li>Reading time is auto-calculated at 220 words per minute.</li>
            </ul>
          </section>
        </aside>
      </div>

      <BlogCategoryManager
        isOpen={categoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
        onChanged={loadCategories}
      />

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Article preview" maxWidth="4xl">
        <div className="mx-auto max-w-3xl space-y-6 font-sans">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            Draft preview only. This preview is not public and is not indexed.
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-ink)]">{form.category || 'Uncategorised'}</p>
            <h1 className="mt-2 text-3xl font-serif font-bold text-gray-900">{form.title || 'Untitled article'}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              {form.author && <span>By {form.author}</span>}
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {computedReadingTime} min read</span>
              <span>{formatDate(new Date().toISOString())}</span>
            </div>
          </div>
          {form.featuredImageUrl && (
            <img src={form.featuredImageUrl} alt={form.featuredImageAlt || ''} className="max-h-80 w-full rounded-2xl object-cover" />
          )}
          {plainText(previewExcerpt) && (
            <div className="border-l-4 border-[#BFA476] pl-4 text-lg italic text-gray-700" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewExcerpt) }} />
          )}
          <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.content) }} />
          {form.sections.map((section, index) => (
            <section key={section.id || index} className="space-y-3 border-t border-gray-100 pt-5">
              {section.heading && <h2 className="text-2xl font-serif font-bold text-gray-900">{section.heading}</h2>}
              <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }} />
            </section>
          ))}
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
              {form.tags.map((tag) => <span key={tag} className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">#{tag}</span>)}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

const FileTextIcon: React.FC = () => (
  <svg className="h-4 w-4 text-[var(--brand-ink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 4h7l4 4v12H7V4z" />
  </svg>
);

const ZapIcon: React.FC = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />
  </svg>
);

export default AdminBlogFormPage;
