import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { postsApi, uploadApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { HiOutlinePhoto, HiOutlineXMark, HiOutlinePlus } from 'react-icons/hi2';

// Dynamically import rich text editor to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = ['Technology', 'Design', 'Development', 'Business', 'Lifestyle', 'Health', 'Travel', 'Food', 'Science', 'Other'];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean']
  ]
};

export default function CreatePost() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', content: '',
    category: 'Technology', tags: [], featuredImage: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [preview, setPreview]       = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to create posts');
      router.push('/auth/login');
    }
  }, [user, authLoading]);

  const onChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addTag = () => {
    const tag = tagInput.trim().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag)) {
      onChange('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (t) => onChange('tags', form.tags.filter((x) => x !== t));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await uploadApi.image(fd);
      onChange('featuredImage', data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed. Using preview only.');
      onChange('featuredImage', preview);
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await postsApi.create(form);
      toast.success('Post published! 🎉');
      router.push(`/posts/${data.post.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally { setSubmitting(false); }
  };

  if (authLoading || !user) return <Layout><div className="pt-32 text-center">Loading…</div></Layout>;

  return (
    <Layout title="Write a Post">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
              <h1 className="font-display font-bold text-3xl">Write a Post</h1>
            </div>
            <p style={{ color: 'var(--muted)' }}>Share your knowledge and ideas with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Featured Image */}
            <div>
              <label className="block text-sm font-semibold mb-2">Featured Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="relative h-52 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors hover:border-[var(--accent)]"
                style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
              >
                {preview || form.featuredImage ? (
                  <>
                    <img src={preview || form.featuredImage} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Change image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <HiOutlinePhoto className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                      {uploading ? 'Uploading…' : 'Click to upload image'}
                    </p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {/* Or paste URL */}
              <div className="mt-2">
                <input
                  value={form.featuredImage}
                  onChange={(e) => { onChange('featuredImage', e.target.value); setPreview(''); }}
                  placeholder="Or paste image URL…"
                  className="input text-sm"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Title <span className="text-red-400">*</span></label>
              <input
                value={form.title}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Give your post a great title…"
                className="input text-base"
                maxLength={150}
                required
              />
              <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{form.title.length}/150</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description <span className="text-red-400">*</span></label>
              <textarea
                value={form.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="A short summary of your post (shown in cards)…"
                className="input resize-none"
                rows={3}
                maxLength={300}
                required
              />
              <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{form.description.length}/300</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category <span className="text-red-400">*</span></label>
              <select
                value={form.category}
                onChange={(e) => onChange('category', e.target.value)}
                className="input"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag, press Enter…"
                  className="input flex-1 text-sm"
                />
                <button type="button" onClick={addTag} className="btn btn-ghost text-sm">
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="tag flex items-center gap-1.5">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Content — Rich text editor */}
            <div>
              <label className="block text-sm font-semibold mb-2">Content <span className="text-red-400">*</span></label>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(val) => onChange('content', val)}
                modules={QUILL_MODULES}
                placeholder="Write your post content here…"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.back()} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
                {submitting ? 'Publishing…' : '🚀 Publish Post'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
