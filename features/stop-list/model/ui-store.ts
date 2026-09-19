import { create } from 'zustand';

export interface Toast {
  id: string;
  variant: 'error' | 'success';
  message: string;
}

interface StopListUiState {
  activePanelItemId: string | null;
  openPanel: (itemId: string) => void;
  closePanel: () => void;
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useStopListUiStore = create<StopListUiState>((set) => ({
  activePanelItemId: null,
  openPanel: (itemId) => set({ activePanelItemId: itemId }),
  closePanel: () => set({ activePanelItemId: null }),
  toasts: [],
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
    })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
