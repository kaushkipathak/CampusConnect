import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-elevated border border-brand-lavender/40 z-10 overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <h3 className="font-display font-bold text-xl text-brand-charcoal">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto pr-1">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
