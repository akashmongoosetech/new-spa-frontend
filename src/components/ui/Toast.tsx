import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, Bell, X, Calendar, ArrowRight } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'admin_alert';
  title: string;
  message?: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  bookingRef?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

const ToastItem: React.FC<{ toast: ToastMessage; onClose: (id: string) => void }> = ({
  toast,
  onClose,
}) => {
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, duration, onClose]);

  return (
    <motion.div
      key={toast.id}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex flex-col gap-2 backdrop-blur-xl relative overflow-hidden transition-all ${
        toast.type === 'admin_alert'
          ? 'bg-[#121B1D]/95 border-[#2CB5A0] text-white shadow-[#2CB5A0]/20 ring-1 ring-[#2CB5A0]/30'
          : toast.type === 'success'
          ? 'bg-[#131E1A]/95 border-[#2CB5A0]/80 text-white shadow-teal-950/40'
          : toast.type === 'error'
          ? 'bg-rose-950/95 border-rose-500/80 text-white shadow-rose-950/40'
          : 'bg-[#182225]/95 border-amber-500/60 text-white shadow-amber-950/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {toast.type === 'admin_alert' && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2CB5A0] to-emerald-400 text-black flex items-center justify-center shrink-0 shadow-md animate-bounce">
            <Bell className="w-4 h-4 text-black font-black" />
          </div>
        )}
        {toast.type === 'success' && (
          <div className="w-8 h-8 rounded-xl bg-[#2CB5A0]/20 text-[#81E3D4] flex items-center justify-center shrink-0 border border-[#2CB5A0]/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
        {toast.type === 'error' && (
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
        {toast.type === 'info' && (
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Info className="w-4 h-4" />
          </div>
        )}

        <div className="flex-1 text-xs leading-relaxed">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              {toast.title}
            </h4>
            {toast.bookingRef && (
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-teal-300">
                #{toast.bookingRef}
              </span>
            )}
          </div>
          {toast.message && (
            <p className="text-gray-300 mt-1 font-sans text-xs">
              {toast.message}
            </p>
          )}

          {toast.actionLabel && toast.onAction && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  onClose(toast.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2CB5A0] hover:bg-[#259b89] text-black font-extrabold text-[11px] inline-flex items-center gap-1 shadow-md cursor-pointer transition-all"
              >
                <span>{toast.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer rounded-lg hover:bg-white/10 shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-dismiss progress bar animation */}
      {duration > 0 && (
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={`h-full ${
              toast.type === 'admin_alert' || toast.type === 'success'
                ? 'bg-[#2CB5A0]'
                : toast.type === 'error'
                ? 'bg-rose-400'
                : 'bg-amber-400'
            }`}
          />
        </div>
      )}
    </motion.div>
  );
};

export const Toast: React.FC<ToastProps> = ({ toasts, onClose }) => {
  return (
    <div
      id="toast-container"
      aria-live="polite"
      role="status"
      className="fixed bottom-6 left-4 right-4 z-50 flex flex-col gap-3 sm:left-auto sm:right-6 sm:w-[420px] sm:max-w-[calc(100vw-3rem)] pointer-events-none"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
