'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useId, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { MenuItem, StopItemPayload } from '@/types/menu';

import { STOP_REASON_LABELS, STOP_REASON_VALUES } from '../model/constants';
import { type StopItemFormInput, type StopItemFormValues, stopItemSchema } from '../model/schema';
import { generateUntilOptions } from '../model/time';
import { Button } from '@/shared/ui/Button';
import { FieldError } from '@/shared/ui/FieldError';
import { Select } from '@/shared/ui/Select';

type UntilMode = 'shift_end' | 'custom';

interface StopReasonPanelProps {
  item: MenuItem;
  onClose: () => void;
  onSubmit: (payload: StopItemPayload) => void;
  isSubmitting: boolean;
}

function initialUntilMode(item: MenuItem): UntilMode {
  return item.status.kind === 'stopped' && item.status.until !== null ? 'custom' : 'shift_end';
}

function initialCustomUntil(item: MenuItem, fallback: string): string {
  return item.status.kind === 'stopped' && item.status.until !== null
    ? item.status.until
    : fallback;
}

export function StopReasonPanel({ item, onClose, onSubmit, isSubmitting }: StopReasonPanelProps) {
  const isEditMode = item.status.kind === 'stopped';
  const headingId = useId();

  const untilOptions = useMemo(() => generateUntilOptions(), []);
  const [untilMode, setUntilMode] = useState<UntilMode>(() => initialUntilMode(item));
  const [customUntil, setCustomUntil] = useState<string>(() =>
    initialCustomUntil(item, untilOptions[0]?.value ?? ''),
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StopItemFormInput, unknown, StopItemFormValues>({
    resolver: zodResolver(stopItemSchema),
    mode: 'onBlur',
    defaultValues: {
      reason: item.status.kind === 'stopped' ? item.status.reason : '',
      until: item.status.kind === 'stopped' ? item.status.until : null,
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onClose]);

  function handleModeChange(mode: UntilMode) {
    setUntilMode(mode);
    setValue('until', mode === 'shift_end' ? null : customUntil, { shouldValidate: true });
  }

  function handleCustomUntilChange(value: string) {
    setCustomUntil(value);
    if (untilMode === 'custom') {
      setValue('until', value, { shouldValidate: true });
    }
  }

  const submitLabel = isEditMode ? 'Сохранить' : 'Поставить в стоп';
  const submitLoadingText = isEditMode ? 'Сохраняем…' : 'Ставим в стоп…';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <motion.div
        className="bg-text/40 absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="border-border bg-surface relative z-10 w-full max-w-md rounded-xl border p-6 shadow-xl"
      >
        <h2 id={headingId} className="text-text text-lg font-semibold">
          {isEditMode ? 'Изменить стоп' : 'Поставить в стоп-лист'}
        </h2>
        <p className="text-muted mt-1 text-sm">{item.title}</p>

        <form
          className="mt-5 flex flex-col gap-4"
          onSubmit={handleSubmit((data) => onSubmit(data))}
        >
          <Select
            label="Причина стопа"
            id="stop-reason"
            error={errors.reason?.message}
            disabled={isSubmitting}
            {...register('reason')}
          >
            <option value="">Выберите причину…</option>
            {STOP_REASON_VALUES.map((reason) => (
              <option key={reason} value={reason}>
                {STOP_REASON_LABELS[reason]}
              </option>
            ))}
          </Select>

          <fieldset className="flex flex-col gap-2" disabled={isSubmitting}>
            <legend className="text-text text-sm font-medium">Срок стопа</legend>

            <label className="text-text flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="until-mode"
                checked={untilMode === 'shift_end'}
                onChange={() => handleModeChange('shift_end')}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              До конца смены
            </label>

            <label className="text-text flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="until-mode"
                checked={untilMode === 'custom'}
                onChange={() => handleModeChange('custom')}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              Конкретное время
            </label>

            {untilMode === 'custom' && (
              <Select
                aria-label="Конкретное время"
                value={customUntil}
                onChange={(event) => handleCustomUntilChange(event.target.value)}
                className="w-40"
              >
                {untilOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}

            <FieldError message={errors.until?.message} />
          </fieldset>

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button type="submit" isLoading={isSubmitting} loadingText={submitLoadingText}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
