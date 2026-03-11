import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { HiOutlineHeart, HiHeart, HiOutlineClock, HiOutlineEye, HiOutlineChatBubbleLeft } from 'react-icons/hi2';
import { postsApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  Technology:  { bg: '#dbeafe', text: '#1d4ed8' },
  Design:      { bg: '#fce7f3', text: '#be185d' },
  Development: { bg: '#d1fae5', text: '#047857' },
  Business:    { bg: '#fef3c7', text: '#b45309' },
  Lifestyle:   { bg: '#ede9fe', text: '#6d28d9' },
  Health:      { bg: '#dcfce7', text: '#15803d' },
  Travel:      { bg: '#ffedd5', text: '#c2410c' },
  Food:        { bg: '#fef9c3', text: '#a16207' },
  Science:     { bg: '#e0f2fe', text: '#0369a1' },
  Other:       { bg: '#f3f4f6', text: '#374151' },
};

export default function BlogCard({ post, index = 0 }) {
  const { user } = useAuth();
  const [likes, setLikes]   = useState(post.likes?.length || 0);
  const [liked, setLiked]   = useState(user ? post.likes?.includes(user.id) : false);

  const catColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Login to like posts'); return; }
    try {
      const { data } = await postsApi.like(post._id);
      setLikes(data.likes);
      setLiked(data.liked);
    } catch {
      toast.error('Failed to like post');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/posts/${post.slug}`}>
        <div className="card group h-full flex flex-col">
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-[var(--border)]">
            {post.featuredImage ? (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-display font-bold opacity-10">
                {post.title?.charAt(0)}
              </div>
            )}
            {/* Category badge */}
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: catColor.bg, color: catColor.text }}>
              {post.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                   style={{ background: 'var(--accent)' }}>
                {post.author?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold">{post.author?.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : ''}
                </p>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: 'var(--muted)' }}>
              {post.description}
            </p>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                <span className="flex items-center gap-1">
                  <HiOutlineClock className="w-3.5 h-3.5" /> {post.readingTime}m
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineEye className="w-3.5 h-3.5" /> {post.views || 0}
                </span>
                {post.comments !== undefined && (
                  <span className="flex items-center gap-1">
                    <HiOutlineChatBubbleLeft className="w-3.5 h-3.5" /> {post.comments}
                  </span>
                )}
              </div>
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-xs transition-transform active:scale-90"
                style={{ color: liked ? '#e85d26' : 'var(--muted)' }}
              >
                {liked ? <HiHeart className="w-4 h-4" /> : <HiOutlineHeart className="w-4 h-4" />}
                {likes}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/** Skeleton loading card */
export function BlogCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
    </div>
  );
}
