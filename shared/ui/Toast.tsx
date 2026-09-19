'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export interface ToastItemData {
  id: string;
  variant: 'error' | 'success';
  message: string;
}

interface ToastViewportProps {
  toasts: ToastItemData[];
  onDismiss: (id: string) => void;
  autoDismissMs?: number;
}

export function ToastViewport({ toasts, onDismiss, autoDismissMs = 5000 }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed right-6 bottom-6 z-50 flex w-80 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            autoDismissMs={autoDismissMs}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
  autoDismissMs,
}: {
  toast: ToastItemData;
  onDismiss: (id: string) => void;
  autoDismissMs: number;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), autoDismissMs);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss, autoDismissMs]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="status"
      className={clsx(
        'bg-surface pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg',
        toast.variant === 'error' ? 'border-accent/40' : 'border-success/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={toast.variant === 'error' ? 'text-accent' : 'text-success'}>
          {toast.message}
        </p>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-muted hover:text-text"
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}
