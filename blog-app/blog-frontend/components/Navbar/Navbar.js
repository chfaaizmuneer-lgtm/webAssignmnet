import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  HiOutlinePencilSquare, HiOutlineSun, HiOutlineMoon,
  HiOutlineUser, HiOutlineBars3, HiOutlineXMark,
  HiOutlineChevronDown, HiOutlineArrowRightOnRectangle,
  HiOutlineSquares2X2
} from 'react-icons/hi2';

const CATEGORIES = ['Technology', 'Design', 'Development', 'Business', 'Lifestyle', 'Health', 'Travel'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const router = useRouter();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
    setProfileOpen(false);
  }, [router.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--bg)]/95 backdrop-blur-md shadow-sm border-b border-[var(--border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                   style={{ background: 'var(--accent)' }}>
                B
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                The Blog
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/">Home</NavLink>

              {/* Categories dropdown */}
              <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--border)]"
                        style={{ color: 'var(--muted)' }}>
                  Categories <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-1 w-48 rounded-xl border shadow-lg py-1.5"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                      {CATEGORIES.map((cat) => (
                        <Link key={cat} href={`/?category=${cat}`}
                              className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--border)]">
                          {cat}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user && <NavLink href="/posts/create">
                <HiOutlinePencilSquare className="w-4 h-4" /> Write
              </NavLink>}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggle}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--border)]"
                aria-label="Toggle theme"
              >
                {isDark
                  ? <HiOutlineSun className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  : <HiOutlineMoon className="w-5 h-5" />}
              </motion.button>

              {/* Auth buttons / profile */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors hover:bg-[var(--border)]"
                  >
                    <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 w-48 rounded-xl border shadow-lg py-1.5"
                        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                      >
                        {user.role === 'admin' && (
                          <DropdownItem href="/admin" icon={<HiOutlineSquares2X2 />}>Dashboard</DropdownItem>
                        )}
                        <DropdownItem href="/profile" icon={<HiOutlineUser />}>Profile</DropdownItem>
                        <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--border)] text-red-500"
                        >
                          <HiOutlineArrowRightOnRectangle className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/auth/login" className="btn btn-ghost text-sm">Login</Link>
                  <Link href="/auth/register" className="btn btn-primary text-sm">Sign Up</Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--border)]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 border-b shadow-lg md:hidden"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="px-4 py-4 space-y-1">
              <MobileNavLink href="/">Home</MobileNavLink>
              {CATEGORIES.map(c => (
                <MobileNavLink key={c} href={`/?category=${c}`}>{c}</MobileNavLink>
              ))}
              {user ? (
                <>
                  <MobileNavLink href="/posts/create">✏️ Write</MobileNavLink>
                  {user.role === 'admin' && <MobileNavLink href="/admin">📊 Dashboard</MobileNavLink>}
                  <MobileNavLink href="/profile">👤 Profile</MobileNavLink>
                  <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-[var(--border)]">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/auth/login"  className="flex-1 btn btn-ghost text-center text-sm">Login</Link>
                  <Link href="/auth/register" className="flex-1 btn btn-primary text-center text-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children }) {
  const router = useRouter();
  const active = router.pathname === href;
  return (
    <Link href={href}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            active ? 'text-[var(--accent)] bg-[var(--border)]' : 'hover:bg-[var(--border)]'
          }`}
          style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}>
      {children}
    </Link>
  );
}

function DropdownItem({ href, icon, children }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--border)]">
      <span className="w-4 h-4">{icon}</span> {children}
    </Link>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <Link href={href} className="block px-3 py-2 text-sm rounded-lg hover:bg-[var(--border)] transition-colors">
      {children}
    </Link>
  );
}
