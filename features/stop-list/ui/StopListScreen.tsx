'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

import type { MenuItem, StopItemPayload } from '@/types/menu';

import { DEFAULT_FILTERS } from '../model/filters';
import { menuItemsQueryOptions } from '../model/queries';
import { useMenuFilters } from '../model/use-menu-filters';
import { useResumeItem, useStopItem } from '../model/use-stop-item';
import { useStopListUiStore } from '../model/ui-store';
import { Filters } from './Filters';
import { StopListEmpty, StopListError, StopListLoading } from './StopListStates';
import { StopListTable, type PendingAction } from './StopListTable';
import { StopReasonPanel } from './StopReasonPanel';

const EMPTY_ITEMS: MenuItem[] = [];

export function StopListScreen() {
  const [filters, setFilters] = useMenuFilters();
  const { data, isPending, isError, error, refetch } = useQuery(menuItemsQueryOptions());

  const stopMutation = useStopItem();
  const resumeMutation = useResumeItem();

  const activePanelItemId = useStopListUiStore((state) => state.activePanelItemId);
  const openPanel = useStopListUiStore((state) => state.openPanel);
  const closePanel = useStopListUiStore((state) => state.closePanel);

  const items = data ?? EMPTY_ITEMS;
  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (filters.shop === 'all' || item.shop === filters.shop) &&
          (filters.status === 'all' || item.status.kind === filters.status),
      ),
    [items, filters],
  );

  const panelItem = items.find((item) => item.id === activePanelItemId) ?? null;
  const hasActiveFilters =
    filters.shop !== DEFAULT_FILTERS.shop || filters.status !== DEFAULT_FILTERS.status;

  const pending: PendingAction | null =
    stopMutation.isPending && stopMutation.variables
      ? { id: stopMutation.variables.id, kind: 'stop' }
      : resumeMutation.isPending && resumeMutation.variables
        ? { id: resumeMutation.variables.id, kind: 'resume' }
        : null;

  function handleStopSubmit(payload: StopItemPayload) {
    if (!panelItem) return;
    stopMutation.mutate({ id: panelItem.id, payload }, { onSettled: () => closePanel() });
  }

  function handleResume(item: MenuItem) {
    resumeMutation.mutate({ id: item.id });
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-text text-2xl font-semibold">Стоп-лист смены</h1>
        <p className="text-muted text-sm">
          Отмечайте позиции, которые сейчас нельзя продать, и возвращайте их обратно в продажу.
        </p>
      </header>

      <Filters />

      {isPending && <StopListLoading />}

      {isError && (
        <StopListError
          message={error instanceof Error ? error.message : 'Не удалось загрузить меню смены'}
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && filteredItems.length === 0 && (
        <StopListEmpty
          hasActiveFilters={hasActiveFilters}
          onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        />
      )}

      {!isPending && !isError && filteredItems.length > 0 && (
        <StopListTable
          items={filteredItems}
          pending={pending}
          onOpenPanel={(item) => openPanel(item.id)}
          onResume={handleResume}
        />
      )}

      <AnimatePresence>
        {panelItem && (
          <StopReasonPanel
            key={panelItem.id}
            item={panelItem}
            onClose={closePanel}
            onSubmit={handleStopSubmit}
            isSubmitting={stopMutation.isPending && stopMutation.variables?.id === panelItem.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
