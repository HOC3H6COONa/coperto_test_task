import { queryOptions } from '@tanstack/react-query';

import type { ApiErrorBody, MenuItem, StopItemPayload } from '@/types/menu';

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: ApiErrorBody['fieldErrors'];

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = body.fieldErrors;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body ?? { message: 'Что-то пошло не так' });
  }
  return response.json() as Promise<T>;
}

export const menuKeys = {
  all: ['menu-items'] as const,
  list: () => [...menuKeys.all, 'list'] as const,
};

export async function fetchMenuItems(signal?: AbortSignal): Promise<MenuItem[]> {
  const response = await fetch('/api/menu-items', { signal });
  return parseJson<MenuItem[]>(response);
}

export function menuItemsQueryOptions() {
  return queryOptions({
    queryKey: menuKeys.list(),
    queryFn: ({ signal }) => fetchMenuItems(signal),
    retry: false,
  });
}

export async function stopMenuItemRequest(id: string, payload: StopItemPayload): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJson<MenuItem>(response);
}

export async function resumeMenuItemRequest(id: string): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/resume`, { method: 'POST' });
  return parseJson<MenuItem>(response);
}
