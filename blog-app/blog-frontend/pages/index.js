import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Hero from '../components/Hero/Hero';
import BlogCard, { BlogCardSkeleton } from '../components/BlogCard/BlogCard';
import { postsApi } from '../hooks/useApi';
import { HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

const CATEGORIES = ['All', 'Technology', 'Design', 'Development', 'Business', 'Lifestyle', 'Health', 'Travel', 'Food', 'Science'];

export default function Home() {
  const router = useRouter();
  const { category: qCat, search: qSearch } = router.query;

  const [featured, setFeatured]     = useState(null);
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch]         = useState(qSearch || '');
  const [category, setCategory]     = useState(qCat || 'All');
  const [inputVal, setInputVal]     = useState(qSearch || '');

  // Fetch featured posts once
  useEffect(() => {
    postsApi.getFeatured().then(({ data }) => setFeatured(data.posts)).catch(() => setFeatured([]));
  }, []);

  // Fetch posts when filters change
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category && category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await postsApi.getAll(params);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Sync query params
  useEffect(() => {
    if (qCat)    setCategory(qCat);
    if (qSearch) { setSearch(qSearch); setInputVal(qSearch); }
  }, [qCat, qSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(inputVal);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    router.push({ query: { ...router.query, category: cat === 'All' ? undefined : cat } }, undefined, { shallow: true });
  };

  return (
    <Layout>
      {/* Hero */}
      <Hero featured={featured} />

      {/* Blog list section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Section header + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
              <h2 className="font-display font-bold text-2xl">Latest Posts</h2>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {pagination?.total || 0} articles published
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search posts…"
                className="input pl-9 text-sm"
              />
            </div>
            <button type="submit" className="btn btn-primary text-sm">Search</button>
          </form>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'text-white shadow-md'
                  : 'hover:bg-[var(--border)]'
              }`}
              style={category === cat
                ? { background: 'var(--accent)', color: 'white' }
                : { color: 'var(--muted)' }
              }
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✍️</div>
            <h3 className="font-display font-bold text-xl mb-2">No posts found</h3>
            <p style={{ color: 'var(--muted)' }}>Try a different search or category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(pagination.pages)].map((_, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  page === i + 1 ? 'text-white shadow' : 'hover:bg-[var(--border)]'
                }`}
                style={page === i + 1 ? { background: 'var(--accent)' } : { color: 'var(--muted)' }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
