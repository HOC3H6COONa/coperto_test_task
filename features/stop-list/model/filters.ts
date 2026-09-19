import type { MenuItemStatus, Shop } from '@/types/menu';

export type ShopFilter = Shop | 'all';
export type StatusFilter = MenuItemStatus['kind'] | 'all';

export interface MenuFilters {
  shop: ShopFilter;
  status: StatusFilter;
}

export const DEFAULT_FILTERS: MenuFilters = { shop: 'all', status: 'all' };

const SHOP_VALUES: readonly Shop[] = ['kitchen', 'bar', 'pastry'];
const STATUS_VALUES: readonly MenuItemStatus['kind'][] = ['available', 'stopped'];

export function normalizeFilters(
  rawShop: string | undefined,
  rawStatus: string | undefined,
): MenuFilters {
  const shop = SHOP_VALUES.includes(rawShop as Shop) ? (rawShop as ShopFilter) : 'all';
  const status = STATUS_VALUES.includes(rawStatus as MenuItemStatus['kind'])
    ? (rawStatus as StatusFilter)
    : 'all';
  return { shop, status };
}

export function filtersFromSearchParamsRecord(
  record: Record<string, string | string[] | undefined>,
): MenuFilters {
  const rawShop = Array.isArray(record.shop) ? record.shop[0] : record.shop;
  const rawStatus = Array.isArray(record.status) ? record.status[0] : record.status;
  return normalizeFilters(rawShop, rawStatus);
}

export function filtersToSearchParams(filters: MenuFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.shop !== 'all') params.set('shop', filters.shop);
  if (filters.status !== 'all') params.set('status', filters.status);
  return params;
}
