import { NextResponse } from 'next/server';

import { findMenuItem, resumeMenuItem } from '@/server/menu-store';
import {
  MUTATION_DELAY_MS,
  MUTATION_ERROR_RATE,
  delay,
  shouldSimulateError,
} from '@/server/simulate';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!findMenuItem(id)) {
    return NextResponse.json({ message: 'Позиция не найдена' }, { status: 404 });
  }

  await delay(MUTATION_DELAY_MS);

  if (shouldSimulateError(MUTATION_ERROR_RATE)) {
    return NextResponse.json(
      { message: 'Сервер не ответил вовремя. Попробуйте ещё раз.' },
      { status: 500 },
    );
  }

  const result = resumeMenuItem(id);
  if (!result.ok) {
    const message =
      result.error === 'out_of_stock'
        ? 'Остаток 0 — нельзя вернуть в продажу'
        : 'Позиция не найдена';
    const status = result.error === 'out_of_stock' ? 400 : 404;
    return NextResponse.json({ message }, { status });
  }

  return NextResponse.json(result.item);
}
