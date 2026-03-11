import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import BlogCard from '../../components/BlogCard/BlogCard';
import { postsApi, authApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { HiOutlinePencilSquare } from 'react-icons/hi2';

export default function Profile() {
  const router = useRouter();
  const { user, updateUser, loading: authLoading } = useAuth();
  const [posts, setPosts]     = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name: '', bio: '', avatar: '' });
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (user) setForm({ name: user.name || '', bio: user.bio || '', avatar: user.avatar || '' });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    postsApi.getAll({ limit: 6 })
      .then(({ data }) => setPosts(data.posts.filter((p) => p.author?._id === user.id || p.author === user.id)))
      .catch(() => {});
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authApi.update(form);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  if (authLoading || !user) return <Layout><div className="pt-32 text-center">Loading…</div></Layout>;

  return (
    <Layout title="Profile">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile card */}
          <div className="card p-8 mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
                   style={{ background: 'var(--accent)' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                {editing ? (
                  <div className="space-y-3">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                           placeholder="Your name" className="input text-lg font-semibold" />
                    <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                              placeholder="A short bio about yourself…" className="input resize-none" rows={2} />
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button onClick={() => setEditing(false)} className="btn btn-ghost">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-display font-bold text-2xl">{user.name}</h1>
                      {user.role === 'admin' && (
                        <span className="tag text-xs" style={{ background: 'rgba(232,93,38,0.1)', color: 'var(--accent)' }}>
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
                      {user.bio || 'No bio yet.'}
                    </p>
                    <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>{user.email}</p>
                    <button onClick={() => setEditing(true)} className="btn btn-ghost text-sm">
                      <HiOutlinePencilSquare className="w-4 h-4" /> Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* My posts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl">My Posts</h2>
              <Link href="/posts/create" className="btn btn-primary text-sm">
                + New Post
              </Link>
            </div>
            {posts.length === 0 ? (
              <div className="text-center py-16 card">
                <p className="text-4xl mb-3">✍️</p>
                <h3 className="font-display font-semibold text-lg mb-2">No posts yet</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Start sharing your ideas</p>
                <Link href="/posts/create" className="btn btn-primary mx-auto">Write your first post</Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((p, i) => <BlogCard key={p._id} post={p} index={i} />)}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
