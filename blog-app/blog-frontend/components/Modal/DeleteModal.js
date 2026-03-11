import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';

export default function DeleteModal({ isOpen, onClose, onConfirm, title = 'Delete Post', loading }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-2xl p-6 shadow-2xl"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <HiOutlineTrash className="w-7 h-7 text-red-500" />
              </div>

              <h2 className="font-display font-bold text-xl text-center mb-2">{title}</h2>
              <p className="text-sm text-center mb-6" style={{ color: 'var(--muted)' }}>
                This action cannot be undone. The post will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 btn btn-ghost" disabled={loading}>
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 btn bg-red-500 hover:bg-red-600 text-white disabled:opacity-60"
                >
                  {loading ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
