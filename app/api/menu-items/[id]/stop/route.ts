import { type NextRequest, NextResponse } from 'next/server';

import { stopItemSchema } from '@/features/stop-list/model/schema';
import { findMenuItem, stopMenuItem } from '@/server/menu-store';
import {
  MUTATION_DELAY_MS,
  MUTATION_ERROR_RATE,
  delay,
  shouldSimulateError,
} from '@/server/simulate';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Некорректное тело запроса' }, { status: 400 });
  }

  const parsed = stopItemSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        message: 'Проверьте форму — есть ошибки',
        fieldErrors: {
          reason: fieldErrors.reason?.[0],
          until: fieldErrors.until?.[0],
        },
      },
      { status: 400 },
    );
  }

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

  const result = stopMenuItem(id, parsed.data);
  if (!result.ok) {
    return NextResponse.json({ message: 'Позиция не найдена' }, { status: 404 });
  }

  return NextResponse.json(result.item);
}
