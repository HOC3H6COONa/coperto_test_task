export const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
export const STEP_MS = 15 * 60 * 1000;

export function validateUntil(value: string | null, now = Date.now()): string | null {
  if (value === null) return null;

  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return 'Некорректное время';
  if (ts <= now) return 'Время должно быть в будущем';
  if (ts - now > MAX_AHEAD_MS) return 'Не больше чем на 24 часа вперёд';
  if (ts % STEP_MS !== 0) return 'Шаг — 15 минут';

  return null;
}

function roundUpToStep(ts: number): number {
  const remainder = ts % STEP_MS;
  return remainder === 0 ? ts : ts + (STEP_MS - remainder);
}

export interface UntilOption {
  value: string;
  label: string;
}

export function generateUntilOptions(now = Date.now()): UntilOption[] {
  const nowDayLabel = new Date(now).toDateString();
  const pad = (n: number) => String(n).padStart(2, '0');
  const options: UntilOption[] = [];

  for (let ts = roundUpToStep(now + STEP_MS); ts - now <= MAX_AHEAD_MS; ts += STEP_MS) {
    const date = new Date(ts);
    const isNextDay = date.toDateString() !== nowDayLabel;
    options.push({
      value: date.toISOString(),
      label: `${pad(date.getHours())}:${pad(date.getMinutes())}${isNextDay ? ' (завтра)' : ''}`,
    });
  }

  return options;
}

export function formatUntilLabel(until: string | null): string {
  if (until === null) return 'До конца смены';
  const date = new Date(until);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `До ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
