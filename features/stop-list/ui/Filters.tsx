'use client';

import type { ChangeEvent } from 'react';

import type { ShopFilter, StatusFilter } from '../model/filters';
import { SHOP_LABELS, STATUS_LABELS } from '../model/constants';
import { useMenuFilters } from '../model/use-menu-filters';
import { Select } from '@/shared/ui/Select';

export function Filters() {
  const [filters, setFilters] = useMenuFilters();

  function handleShopChange(event: ChangeEvent<HTMLSelectElement>) {
    setFilters({ shop: event.target.value as ShopFilter });
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    setFilters({ status: event.target.value as StatusFilter });
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <Select
        label="Цех"
        id="shop-filter"
        value={filters.shop}
        onChange={handleShopChange}
        className="w-52"
      >
        <option value="all">Все цеха</option>
        {Object.entries(SHOP_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Select
        label="Статус"
        id="status-filter"
        value={filters.status}
        onChange={handleStatusChange}
        className="w-52"
      >
        <option value="all">Все статусы</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}
