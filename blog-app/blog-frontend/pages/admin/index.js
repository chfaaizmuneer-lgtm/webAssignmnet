import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import DeleteModal from '../../components/Modal/DeleteModal';
import { postsApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineDocumentText, HiOutlineEye, HiOutlineHeart, HiOutlineChartBar,
  HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePlus
} from 'react-icons/hi2';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [posts, setPosts]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId]     = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast.error('Admin access required');
      router.push('/');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    postsApi.adminAll({ page, limit: 15 })
      .then(({ data }) => { setPosts(data.posts); setStats(data.stats); setPagination(data.pagination); })
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  }, [page, user]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postsApi.delete(deleteId);
      setPosts((prev) => prev.filter((p) => p._id !== deleteId));
      toast.success('Post deleted!');
      setDeleteId(null);
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  if (authLoading || !user) return <Layout><div className="pt-32 text-center">Loading…</div></Layout>;

  const statCards = [
    { label: 'Total Posts', value: stats?.total || 0, icon: HiOutlineDocumentText, color: '#e85d26' },
    { label: 'Published', value: stats?.published || 0, icon: HiOutlineChartBar, color: '#059669' },
    { label: 'Total Views', value: stats?.totalViews?.toLocaleString() || 0, icon: HiOutlineEye, color: '#7c3aed' },
    { label: 'Categories', value: stats?.categories?.length || 0, icon: HiOutlineHeart, color: '#db2777' },
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">Dashboard</h1>
            <p style={{ color: 'var(--muted)' }}>Manage all your blog posts</p>
          </div>
          <Link href="/posts/create" className="btn btn-primary">
            <HiOutlinePlus className="w-4 h-4" /> New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: `${color}20`, color }}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="font-display font-bold text-2xl">{value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Posts table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-display font-semibold text-lg">All Posts</h2>
            <span className="tag">{pagination?.total || 0} total</span>
          </div>

          {loading ? (
            <div className="p-8 text-center" style={{ color: 'var(--muted)' }}>Loading posts…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider border-b" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                    <th className="px-6 py-3">Post</th>
                    <th className="px-4 py-3 hidden md:table-cell">Author</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Category</th>
                    <th className="px-4 py-3 hidden md:table-cell">Views</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
                  {posts.map((post, i) => (
                    <motion.tr
                      key={post._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-[var(--border)]/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.featuredImage && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <Link href={`/posts/${post.slug}`}
                                  className="font-medium text-sm hover:text-[var(--accent)] transition-colors line-clamp-1">
                              {post.title}
                            </Link>
                            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--muted)' }}>
                              {post.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-sm">{post.author?.name}</td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="tag text-xs">{post.category}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-sm" style={{ color: 'var(--muted)' }}>
                        {post.views?.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-xs" style={{ color: 'var(--muted)' }}>
                        {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : ''}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/posts/edit/${post._id}`}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--border)] transition-colors"
                                title="Edit">
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(post._id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t flex justify-center gap-2" style={{ borderColor: 'var(--border)' }}>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          page === i + 1 ? 'text-white' : 'hover:bg-[var(--border)]'
                        }`}
                        style={page === i + 1 ? { background: 'var(--accent)' } : { color: 'var(--muted)' }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Layout>
  );
}
