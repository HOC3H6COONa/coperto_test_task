'use client';

import { motion } from 'framer-motion';

import type { MenuItem } from '@/types/menu';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Spinner } from '@/shared/ui/Spinner';

import { SHOP_LABELS, STOP_REASON_LABELS } from '../model/constants';
import { formatUntilLabel } from '../model/time';

export interface PendingAction {
  id: string;
  kind: 'stop' | 'resume';
}

interface StopListTableProps {
  items: MenuItem[];
  pending: PendingAction | null;
  onOpenPanel: (item: MenuItem) => void;
  onResume: (item: MenuItem) => void;
}

export function StopListTable({ items, pending, onOpenPanel, onResume }: StopListTableProps) {
  return (
    <div className="border-border bg-surface overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[1040px] table-fixed border-collapse text-left text-sm">
        <thead>
          <tr className="border-border text-muted border-b text-xs tracking-wide uppercase">
            <th className="px-4 py-3 font-medium">Позиция</th>
            <th className="w-36 px-4 py-3 font-medium">Цех</th>
            <th className="w-28 px-4 py-3 font-medium">Остаток</th>
            <th className="w-64 px-4 py-3 font-medium">Статус</th>
            <th className="w-[27rem] px-4 py-3 font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isStopped = item.status.kind === 'stopped';
            const isRowPending = pending?.id === item.id;
            const canResume = item.stock > 0;

            return (
              <motion.tr
                key={item.id}
                animate={{ opacity: isStopped ? 0.7 : 1 }}
                transition={{ duration: 0.25 }}
                className="border-border border-b last:border-0"
              >
                <td className="text-text truncate px-4 py-3 font-medium" title={item.title}>
                  {item.title}
                  {isRowPending && (
                    <span className="ml-2 inline-flex align-middle">
                      <Spinner className="text-muted h-3.5 w-3.5" />
                      <span className="sr-only">Сохраняется…</span>
                    </span>
                  )}
                </td>
                <td className="text-text px-4 py-3">{SHOP_LABELS[item.shop]}</td>
                <td className="text-text px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">
                  {item.status.kind === 'available' ? (
                    <Badge variant="success">В продаже</Badge>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <Badge variant="stopped">{STOP_REASON_LABELS[item.status.reason]}</Badge>
                      <span className="text-muted text-xs">
                        {formatUntilLabel(item.status.until)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {item.status.kind === 'available' ? (
                      <Button
                        variant="secondary"
                        className="w-44 shrink-0"
                        onClick={() => onOpenPanel(item)}
                        disabled={isRowPending}
                      >
                        Поставить в стоп
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          className="w-44 shrink-0"
                          onClick={() => onResume(item)}
                          disabled={isRowPending || !canResume}
                          isLoading={isRowPending && pending?.kind === 'resume'}
                          loadingText="Возвращаем…"
                          title={canResume ? undefined : 'Остаток 0 — нельзя вернуть в продажу'}
                        >
                          Вернуть в продажу
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-44 shrink-0"
                          onClick={() => onOpenPanel(item)}
                          disabled={isRowPending}
                        >
                          Изменить
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
