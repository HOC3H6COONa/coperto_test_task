'use client';

import { useStopListUiStore } from '@/features/stop-list/model/ui-store';
import { ToastViewport } from '@/shared/ui/Toast';

export function ToastHost() {
  const toasts = useStopListUiStore((state) => state.toasts);
  const dismissToast = useStopListUiStore((state) => state.dismissToast);

  return <ToastViewport toasts={toasts} onDismiss={dismissToast} />;
}
