import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back! 👋');
      router.push(router.query.redirect || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Login">
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="rounded-2xl p-8 shadow-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-4"
                   style={{ background: 'var(--accent)' }}>
                B
              </div>
              <h1 className="font-display font-bold text-2xl mb-1">Welcome back</h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input pl-10 pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                    {showPw ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full justify-center py-3" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: 'var(--border)' }}>
              <p className="font-semibold mb-1" style={{ color: 'var(--muted)' }}>Demo accounts:</p>
              <p style={{ color: 'var(--muted)' }}>Admin: admin@blogapp.com / admin123</p>
              <p style={{ color: 'var(--muted)' }}>User: user@blogapp.com / user123</p>
            </div>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-semibold hover:text-[var(--accent)]">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
