'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import {
  type MenuFilters,
  filtersToSearchParams,
  normalizeFilters,
} from '@/features/stop-list/model/filters';

export function useMenuFilters(): [MenuFilters, (patch: Partial<MenuFilters>) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () =>
      normalizeFilters(
        searchParams.get('shop') ?? undefined,
        searchParams.get('status') ?? undefined,
      ),
    [searchParams],
  );

  const setFilters = useCallback(
    (patch: Partial<MenuFilters>) => {
      const next = { ...filters, ...patch };
      const query = filtersToSearchParams(next).toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filters, pathname, router],
  );

  return [filters, setFilters];
}
