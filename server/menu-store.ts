import type { MenuItem, StopItemPayload } from '@/types/menu';

function minutesFromNow(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function createSeed(): MenuItem[] {
  const now = new Date().toISOString();

  return [
    {
      id: 'itm-01',
      title: 'Стейк из лосося',
      shop: 'kitchen',
      stock: 12,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-02',
      title: 'Бургер «Ковбой»',
      shop: 'kitchen',
      stock: 0,
      status: { kind: 'stopped', reason: 'out_of_stock', until: null },
      updatedAt: now,
    },
    {
      id: 'itm-03',
      title: 'Паста Карбонара',
      shop: 'kitchen',
      stock: 8,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-04',
      title: 'Крылья BBQ',
      shop: 'kitchen',
      stock: 15,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-05',
      title: 'Том Ям',
      shop: 'kitchen',
      stock: 3,
      status: { kind: 'stopped', reason: 'equipment', until: minutesFromNow(120) },
      updatedAt: now,
    },
    {
      id: 'itm-06',
      title: 'Мохито',
      shop: 'bar',
      stock: 20,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-07',
      title: 'Апероль Шпритц',
      shop: 'bar',
      stock: 0,
      status: { kind: 'stopped', reason: 'out_of_stock', until: null },
      updatedAt: now,
    },
    {
      id: 'itm-08',
      title: 'Лимонад Клубника-Базилик',
      shop: 'bar',
      stock: 6,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-09',
      title: 'Кофе Флэт Уайт',
      shop: 'bar',
      stock: 25,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-10',
      title: 'Глинтвейн',
      shop: 'bar',
      stock: 9,
      status: { kind: 'stopped', reason: 'menu_change', until: null },
      updatedAt: now,
    },
    {
      id: 'itm-11',
      title: 'Чизкейк Нью-Йорк',
      shop: 'pastry',
      stock: 7,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-12',
      title: 'Круассан классический',
      shop: 'pastry',
      stock: 14,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-13',
      title: 'Тирамису',
      shop: 'pastry',
      stock: 5,
      status: { kind: 'available' },
      updatedAt: now,
    },
    {
      id: 'itm-14',
      title: 'Эклер шоколадный',
      shop: 'pastry',
      stock: 0,
      status: { kind: 'available' },
      updatedAt: now,
    },
  ];
}

const globalStore = globalThis as unknown as { __menuStore?: MenuItem[] };

const store = globalStore.__menuStore ?? createSeed();
globalStore.__menuStore = store;

function cloneItem(item: MenuItem): MenuItem {
  return { ...item, status: { ...item.status } };
}

export function listMenuItems(): MenuItem[] {
  return store.map(cloneItem);
}

export function findMenuItem(id: string): MenuItem | undefined {
  const item = store.find((candidate) => candidate.id === id);
  return item ? cloneItem(item) : undefined;
}

export type StopMenuItemResult = { ok: true; item: MenuItem } | { ok: false; error: 'not_found' };

export function stopMenuItem(id: string, payload: StopItemPayload): StopMenuItemResult {
  const index = store.findIndex((candidate) => candidate.id === id);
  if (index === -1) return { ok: false, error: 'not_found' };

  const updated: MenuItem = {
    ...store[index],
    status: { kind: 'stopped', reason: payload.reason, until: payload.until },
    updatedAt: new Date().toISOString(),
  };
  store[index] = updated;
  return { ok: true, item: cloneItem(updated) };
}

export type ResumeMenuItemResult =
  { ok: true; item: MenuItem } | { ok: false; error: 'not_found' | 'out_of_stock' };

export function resumeMenuItem(id: string): ResumeMenuItemResult {
  const index = store.findIndex((candidate) => candidate.id === id);
  if (index === -1) return { ok: false, error: 'not_found' };
  if (store[index].stock <= 0) return { ok: false, error: 'out_of_stock' };

  const updated: MenuItem = {
    ...store[index],
    status: { kind: 'available' },
    updatedAt: new Date().toISOString(),
  };
  store[index] = updated;
  return { ok: true, item: cloneItem(updated) };
}
