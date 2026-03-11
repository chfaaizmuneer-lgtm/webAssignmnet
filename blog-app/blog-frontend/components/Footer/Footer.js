import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiTwitter, FiGithub, FiInstagram, FiLinkedin, FiRss } from 'react-icons/fi';

const CATEGORIES = ['Technology', 'Design', 'Development', 'Business', 'Lifestyle'];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thanks for subscribing! 🎉');
    setEmail('');
  };

  return (
    <footer className="mt-24 border-t" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                   style={{ background: 'var(--accent)' }}>
                B
              </div>
              <span className="font-display font-bold text-xl">The Blog</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--muted)' }}>
              A platform for thinkers, makers, and creators. Share your ideas with the world.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input flex-1 text-sm"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap text-sm">
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Categories
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/?category=${cat}`}
                        className="text-sm transition-colors hover:text-[var(--accent)]"
                        style={{ color: 'var(--muted)' }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              About
            </h4>
            <ul className="space-y-2.5">
              {['About Us', 'Write for Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm transition-colors hover:text-[var(--accent)]"
                        style={{ color: 'var(--muted)' }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
             style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © {new Date().getFullYear()} The Blog. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: FiTwitter, href: '#' },
              { icon: FiGithub, href: '#' },
              { icon: FiInstagram, href: '#' },
              { icon: FiLinkedin, href: '#' },
              { icon: FiRss, href: '#' },
            ].map(({ icon: Icon, href }) => (
              <a key={href + Icon} href={href}
                 className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--border)] hover:text-[var(--accent)]"
                 style={{ color: 'var(--muted)' }}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
