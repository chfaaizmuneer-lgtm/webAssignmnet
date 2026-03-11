import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout title="404 — Not Found">
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="font-display font-bold text-9xl mb-4 opacity-10">404</div>
          <div className="font-display font-bold text-3xl mb-3">Page Not Found</div>
          <p className="mb-8" style={{ color: 'var(--muted)' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
