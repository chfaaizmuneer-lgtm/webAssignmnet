import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { HiOutlineClock, HiOutlineEye, HiArrowRight } from 'react-icons/hi2';

export default function Hero({ featured }) {
  if (!featured) return <HeroSkeleton />;

  const post = featured[0];
  const trending = featured.slice(1, 4);

  return (
    <section className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main featured post */}
        {post && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <Link href={`/posts/${post.slug}`}>
              <div className="card group relative h-[480px] flex flex-col justify-end overflow-hidden">
                {/* Background image */}
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent)] text-white mb-3">
                    Featured
                  </span>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mb-2">
                    {post.title}
                  </h1>
                  <p className="text-white/75 text-sm line-clamp-2 mb-4">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <span className="font-semibold text-white">{post.author?.name}</span>
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="w-3.5 h-3.5" /> {post.readingTime}m read
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineEye className="w-3.5 h-3.5" /> {post.views}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-white text-sm font-semibold group-hover:gap-2 transition-all">
                      Read <HiArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Trending posts sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
            <h2 className="font-display font-semibold text-lg">Trending Now</h2>
          </div>
          {trending.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
            >
              <Link href={`/posts/${p.slug}`}>
                <div className="card group flex gap-4 p-4">
                  {p.featuredImage && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                      <img src={p.featuredImage} alt={p.title}
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      {p.category}
                    </span>
                    <h3 className="font-display font-semibold text-sm leading-snug mt-0.5 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                      <span>{p.author?.name}</span>
                      <span>·</span>
                      <span>{p.readingTime}m read</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 skeleton h-[480px] rounded-2xl" />
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="skeleton h-6 w-32 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card flex gap-4 p-4">
              <div className="skeleton w-20 h-20 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-4/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
