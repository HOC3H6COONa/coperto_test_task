'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MenuItem, StopItemPayload } from '@/types/menu';

import { useStopListUiStore } from './ui-store';
import { type ApiError, menuKeys, resumeMenuItemRequest, stopMenuItemRequest } from './queries';

interface MutationContext {
  previous?: MenuItem[];
}

const listKey = menuKeys.list();

export function useStopItem() {
  const queryClient = useQueryClient();
  const pushToast = useStopListUiStore((state) => state.pushToast);

  return useMutation<MenuItem, ApiError, { id: string; payload: StopItemPayload }, MutationContext>(
    {
      mutationKey: ['menu-item', 'stop'],
      mutationFn: ({ id, payload }) => stopMenuItemRequest(id, payload),
      onMutate: async ({ id, payload }) => {
        await queryClient.cancelQueries({ queryKey: listKey });
        const previous = queryClient.getQueryData<MenuItem[]>(listKey);

        queryClient.setQueryData<MenuItem[]>(listKey, (items = []) =>
          items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: { kind: 'stopped', reason: payload.reason, until: payload.until },
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        );

        return { previous };
      },
      onError: (error, _variables, context) => {
        if (context?.previous) queryClient.setQueryData(listKey, context.previous);
        pushToast({
          variant: 'error',
          message: error.message || 'Не удалось поставить позицию в стоп-лист',
        });
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey: menuKeys.all });
      },
    },
  );
}

export function useResumeItem() {
  const queryClient = useQueryClient();
  const pushToast = useStopListUiStore((state) => state.pushToast);

  return useMutation<MenuItem, ApiError, { id: string }, MutationContext>({
    mutationKey: ['menu-item', 'resume'],
    mutationFn: ({ id }) => resumeMenuItemRequest(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<MenuItem[]>(listKey);

      queryClient.setQueryData<MenuItem[]>(listKey, (items = []) =>
        items.map((item) =>
          item.id === id
            ? { ...item, status: { kind: 'available' }, updatedAt: new Date().toISOString() }
            : item,
        ),
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous);
      pushToast({
        variant: 'error',
        message: error.message || 'Не удалось вернуть позицию в продажу',
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}
