import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../../components/Layout';
import { postsApi, uploadApi } from '../../../hooks/useApi';
import { useAuth } from '../../../context/AuthContext';
import { HiOutlinePhoto, HiOutlineXMark, HiOutlinePlus } from 'react-icons/hi2';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = ['Technology', 'Design', 'Development', 'Business', 'Lifestyle', 'Health', 'Travel', 'Food', 'Science', 'Other'];
const QUILL_MODULES = {
  toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline'], ['blockquote', 'code-block'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']]
};

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm]           = useState(null);
  const [tagInput, setTagInput]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!id) return;
    postsApi.getOne(id)
      .then(({ data }) => {
        const p = data.post;
        setForm({
          title: p.title || '',
          description: p.description || '',
          content: p.content || '',
          category: p.category || 'Technology',
          tags: p.tags || [],
          featuredImage: p.featuredImage || ''
        });
      })
      .catch(() => { toast.error('Post not found'); router.push('/'); })
      .finally(() => setLoading(false));
  }, [id]);

  const onChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addTag = () => {
    const tag = tagInput.trim().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag)) onChange('tags', [...form.tags, tag]);
    setTagInput('');
  };

  const removeTag = (t) => onChange('tags', form.tags.filter((x) => x !== t));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await uploadApi.image(fd);
      onChange('featuredImage', data.url);
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await postsApi.update(id, form);
      toast.success('Post updated!');
      router.push(`/posts/${data.post.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    } finally { setSubmitting(false); }
  };

  if (loading || !form) return <Layout><div className="pt-32 text-center">Loading…</div></Layout>;

  return (
    <Layout title="Edit Post">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
              <h1 className="font-display font-bold text-3xl">Edit Post</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image */}
            <div>
              <label className="block text-sm font-semibold mb-2">Featured Image</label>
              <div onClick={() => fileRef.current?.click()}
                   className="relative h-44 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden hover:border-[var(--accent)] transition-colors"
                   style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                {form.featuredImage ? (
                  <>
                    <img src={form.featuredImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm">Change image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <HiOutlinePhoto className="w-8 h-8 mx-auto mb-1" style={{ color: 'var(--muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>{uploading ? 'Uploading…' : 'Upload image'}</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <input value={form.featuredImage} onChange={(e) => onChange('featuredImage', e.target.value)}
                     placeholder="Or paste image URL…" className="input text-sm mt-2" />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input value={form.title} onChange={(e) => onChange('title', e.target.value)}
                     className="input text-base" maxLength={150} required />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea value={form.description} onChange={(e) => onChange('description', e.target.value)}
                        className="input resize-none" rows={3} maxLength={300} required />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select value={form.category} onChange={(e) => onChange('category', e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                       placeholder="Add tag, press Enter…" className="input flex-1 text-sm" />
                <button type="button" onClick={addTag} className="btn btn-ghost"><HiOutlinePlus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="tag flex items-center gap-1.5">
                    #{tag} <button type="button" onClick={() => removeTag(tag)}><HiOutlineXMark className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold mb-2">Content</label>
              <ReactQuill theme="snow" value={form.content} onChange={(v) => onChange('content', v)} modules={QUILL_MODULES} />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.back()} className="btn btn-ghost">Cancel</button>
              <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
                {submitting ? 'Saving…' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
