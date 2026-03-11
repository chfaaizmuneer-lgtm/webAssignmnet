import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import BlogCard from '../../components/BlogCard/BlogCard';
import DeleteModal from '../../components/Modal/DeleteModal';
import { postsApi, commentsApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineClock, HiOutlineEye, HiOutlineHeart, HiHeart,
  HiOutlinePencilSquare, HiOutlineTrash, HiOutlineChatBubbleLeft,
  HiOutlineShare, HiOutlineTag, HiArrowLeft
} from 'react-icons/hi2';
import { FiTwitter, FiLinkedin, FiLink } from 'react-icons/fi';

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();

  const [post, setPost]               = useState(null);
  const [related, setRelated]         = useState([]);
  const [comments, setComments]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [liked, setLiked]             = useState(false);
  const [likes, setLikes]             = useState(0);
  const [showDelete, setShowDelete]   = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          postsApi.getOne(slug),
          commentsApi.getAll(slug).catch(() => ({ data: { comments: [] } }))
        ]);
        setPost(postRes.data.post);
        setRelated(postRes.data.related || []);
        setComments(commentsRes.data.comments);
        setLikes(postRes.data.post.likes?.length || 0);
        setLiked(user ? postRes.data.post.likes?.includes(user.id) : false);
      } catch {
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) { toast.error('Please login to like posts'); return; }
    try {
      const { data } = await postsApi.like(post._id);
      setLikes(data.likes);
      setLiked(data.liked);
    } catch { toast.error('Failed to like post'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postsApi.delete(post._id);
      toast.success('Post deleted!');
      router.push('/');
    } catch { toast.error('Failed to delete post'); setDeleting(false); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) { toast.error('Please login to comment'); return; }
    setSubmitting(true);
    try {
      const { data } = await commentsApi.add(post._id, { content: commentText });
      setComments((prev) => [data.comment, ...prev]);
      setCommentText('');
      toast.success('Comment added!');
    } catch { toast.error('Failed to add comment'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsApi.delete(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch { toast.error('Failed to delete comment'); }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied!');
  };

  if (loading) return <Layout><PostSkeleton /></Layout>;
  if (!post)   return null;

  const isAuthor = user && (post.author?._id === user.id || user.role === 'admin');

  return (
    <Layout title={post.title} description={post.description}>
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-4">
        <button onClick={() => router.back()}
                className="flex items-center gap-2 text-sm hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--muted)' }}>
          <HiArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Hero image */}
      {post.featuredImage && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 mb-8"
        >
          <div className="rounded-2xl overflow-hidden h-72 md:h-96">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main article */}
          <motion.article
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category + actions */}
            <div className="flex items-center justify-between mb-4">
              <Link href={`/?category=${post.category}`}
                    className="tag text-xs font-semibold"
                    style={{ background: 'rgba(232,93,38,0.1)', color: 'var(--accent)' }}>
                {post.category}
              </Link>
              {isAuthor && (
                <div className="flex gap-2">
                  <Link href={`/posts/edit/${post._id}`} className="btn btn-ghost text-sm py-1.5">
                    <HiOutlinePencilSquare className="w-4 h-4" /> Edit
                  </Link>
                  <button onClick={() => setShowDelete(true)} className="btn text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-sm py-1.5">
                    <HiOutlineTrash className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-5">
              {post.title}
            </h1>

            {/* Author + meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                     style={{ background: 'var(--accent)' }}>
                  {post.author?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{post.author?.name}</p>
                  {post.author?.bio && (
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{post.author.bio}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--muted)' }}>
                <span>{post.createdAt ? format(new Date(post.createdAt), 'MMMM d, yyyy') : ''}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><HiOutlineClock className="w-4 h-4" /> {post.readingTime} min read</span>
                <span className="flex items-center gap-1"><HiOutlineEye className="w-4 h-4" /> {post.views}</span>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose-blog text-base leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                <HiOutlineTag className="w-4 h-4 mt-0.5" style={{ color: 'var(--muted)' }} />
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/?tag=${tag}`} className="tag hover:text-[var(--accent)] transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Like + Share */}
            <div className="flex items-center justify-between mb-10">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleLike}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
                style={liked
                  ? { background: 'rgba(232,93,38,0.1)', color: 'var(--accent)' }
                  : { background: 'var(--border)', color: 'var(--muted)' }
                }
              >
                {liked ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                {likes} {likes === 1 ? 'Like' : 'Likes'}
              </motion.button>

              <div className="flex items-center gap-2">
                <span className="text-sm mr-2" style={{ color: 'var(--muted)' }}>Share:</span>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`}
                   target="_blank" rel="noreferrer"
                   className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--border)] transition-colors">
                  <FiTwitter className="w-4 h-4" />
                </a>
                <a href={`https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                   target="_blank" rel="noreferrer"
                   className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--border)] transition-colors">
                  <FiLinkedin className="w-4 h-4" />
                </a>
                <button onClick={copyLink}
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--border)] transition-colors">
                  <FiLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Comments */}
            <section>
              <h3 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
                <HiOutlineChatBubbleLeft className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                {comments.length} Comments
              </h3>

              {/* Comment form */}
              {user ? (
                <form onSubmit={handleComment} className="mb-7">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts…"
                    rows={3}
                    className="input mb-3 resize-none"
                  />
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Posting…' : 'Post Comment'}
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl mb-7 text-sm text-center" style={{ background: 'var(--border)' }}>
                  <Link href="/auth/login" className="font-semibold hover:text-[var(--accent)]">Login</Link>{' '}
                  to leave a comment
                </div>
              )}

              {/* Comment list */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <motion.div
                    key={c._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                         style={{ background: 'var(--accent)' }}>
                      {c.author?.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{c.author?.name}</span>
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>
                          {c.createdAt ? format(new Date(c.createdAt), 'MMM d, yyyy') : ''}
                        </span>
                        {user && (user.id === c.author?._id || user.role === 'admin') && (
                          <button onClick={() => handleDeleteComment(c._id)}
                                  className="text-xs text-red-400 hover:text-red-500 ml-auto">
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{c.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div>
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} />
                  Related
                </h4>
                <div className="space-y-4">
                  {related.map((p) => (
                    <Link key={p._id} href={`/posts/${p.slug}`}>
                      <div className="group p-3 rounded-xl hover:bg-[var(--border)] transition-colors">
                        {p.featuredImage && (
                          <div className="rounded-lg overflow-hidden h-24 mb-2">
                            <img src={p.featuredImage} alt={p.title}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        <p className="text-xs font-semibold leading-snug group-hover:text-[var(--accent)] transition-colors">
                          {p.title}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{p.readingTime}m read</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <DeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Layout>
  );
}

function PostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
      <div className="skeleton h-80 rounded-2xl mb-8" />
      <div className="space-y-4">
        <div className="skeleton h-8 w-20 rounded-full" />
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-4/5 rounded" />
        <div className="skeleton h-4 w-48 rounded" />
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-4 w-full rounded" />)}
      </div>
    </div>
  );
}
