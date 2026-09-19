import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MenuItem } from '@/types/menu';

import { menuKeys } from './queries';
import { useStopListUiStore } from './ui-store';
import { useStopItem } from './use-stop-item';

const seedItem: MenuItem = {
  id: 'itm-01',
  title: 'Стейк из лосося',
  shop: 'kitchen',
  stock: 12,
  status: { kind: 'available' },
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useStopItem', () => {
  beforeEach(() => {
    useStopListUiStore.setState({ toasts: [], activePanelItemId: null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('applies the new status optimistically, then rolls back and toasts on a server error', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    queryClient.setQueryData(menuKeys.list(), [seedItem]);

    let resolveFetch!: (response: Partial<Response>) => void;
    const pendingResponse = new Promise<Partial<Response>>((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal(
      'fetch',
      vi.fn(() => pendingResponse),
    );

    const { result } = renderHook(() => useStopItem(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: seedItem.id,
        payload: { reason: 'equipment', until: null },
      });
    });

    await waitFor(() => {
      const items = queryClient.getQueryData<MenuItem[]>(menuKeys.list());
      expect(items?.[0].status.kind).toBe('stopped');
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/menu-items/itm-01/stop',
      expect.objectContaining({ method: 'POST' }),
    );

    act(() => {
      resolveFetch({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Сервер не ответил вовремя. Попробуйте ещё раз.' }),
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const items = queryClient.getQueryData<MenuItem[]>(menuKeys.list());
    expect(items?.[0].status.kind).toBe('available');

    const toasts = useStopListUiStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].variant).toBe('error');
  });
});
