import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-[#FFF8F2] dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-[#F1E6DA] dark:border-stone-800"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E6DA] dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  variant === 'danger' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100">{title}</h3>
              </div>
              <button
                onClick={onCancel}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="py-4 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E6DA] dark:border-stone-800">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-2xl transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2.5 text-sm font-semibold text-white rounded-2xl shadow-md transition-all ${
                  variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-[#FF8A3D] hover:bg-[#F97316] shadow-[#FF8A3D]/20'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
