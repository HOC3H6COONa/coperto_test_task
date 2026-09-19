import { Button } from '@/shared/ui/Button';

export function StopListLoading() {
  return (
    <div className="border-border bg-surface overflow-hidden rounded-xl border">
      <div className="border-border border-b px-4 py-3">
        <div className="bg-surface-muted h-3 w-40 animate-pulse rounded" />
      </div>
      <ul className="divide-border divide-y">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="flex items-center gap-4 px-4 py-4">
            <div className="bg-surface-muted h-4 w-40 animate-pulse rounded" />
            <div className="bg-surface-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-surface-muted h-4 w-12 animate-pulse rounded" />
            <div className="bg-surface-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-surface-muted ml-auto h-8 w-32 animate-pulse rounded" />
          </li>
        ))}
      </ul>
      <span className="sr-only">Загружаем меню смены…</span>
    </div>
  );
}

interface StopListErrorProps {
  message: string;
  onRetry: () => void;
}

export function StopListError({ message, onRetry }: StopListErrorProps) {
  return (
    <div className="border-accent/30 bg-surface flex flex-col items-center gap-3 rounded-xl border px-6 py-12 text-center">
      <p className="text-accent text-sm font-medium">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        Повторить попытку
      </Button>
    </div>
  );
}

interface StopListEmptyProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function StopListEmpty({ hasActiveFilters, onResetFilters }: StopListEmptyProps) {
  return (
    <div className="border-border bg-surface flex flex-col items-center gap-3 rounded-xl border px-6 py-12 text-center">
      <p className="text-text text-sm font-medium">
        {hasActiveFilters ? 'Нет позиций по выбранным фильтрам' : 'Меню смены пусто'}
      </p>
      {hasActiveFilters && (
        <Button variant="secondary" onClick={onResetFilters}>
          Сбросить фильтры
        </Button>
      )}
    </div>
  );
}
