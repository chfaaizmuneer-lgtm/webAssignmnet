import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome 🎉');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Sign Up">
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="rounded-2xl p-8 shadow-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-4"
                   style={{ background: 'var(--accent)' }}>B</div>
              <h1 className="font-display font-bold text-2xl mb-1">Create an account</h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Join the community of writers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                         placeholder="Your name" className="input pl-10" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                         placeholder="you@example.com" className="input pl-10" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                         onChange={(e) => setForm({ ...form, password: e.target.value })}
                         placeholder="Min 6 characters" className="input pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                    {showPw ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center py-3" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold hover:text-[var(--accent)]">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
