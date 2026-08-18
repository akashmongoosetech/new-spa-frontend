import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

let modalOpenCount = 0;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  maxWidth,
  size,
  children,
}) => {
  const chosenSize = size || maxWidth || 'lg';
  const widthClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };
  const widthClass = widthClasses[chosenSize] || (chosenSize.startsWith('max-w-') ? chosenSize : `max-w-${chosenSize}`);
  useEffect(() => {
    if (!isOpen) return;

    modalOpenCount += 1;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      modalOpenCount -= 1;
      if (modalOpenCount <= 0) {
        modalOpenCount = 0;
        document.body.style.overflow = '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Modal dialog'}
            className={`relative w-full ${widthClass} bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden z-10 my-8`}
          >
            {title && (
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-serif font-bold text-gray-900">{title}</h3>
                <button
                  id="modal-close-button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {!title && (
              <button
                id="modal-close-icon-only"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="p-6 max-h-[85vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
