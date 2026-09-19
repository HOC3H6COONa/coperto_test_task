import { NextResponse } from 'next/server';

import { listMenuItems } from '@/server/menu-store';
import { GET_LIST_DELAY_MS, delay, shouldSimulateError } from '@/server/simulate';

const GET_ERROR_RATE = 0.12;

export async function GET() {
  await delay(GET_LIST_DELAY_MS);

  if (shouldSimulateError(GET_ERROR_RATE)) {
    return NextResponse.json(
      { message: 'Не удалось загрузить меню смены. Попробуйте ещё раз.' },
      { status: 500 },
    );
  }

  return NextResponse.json(listMenuItems());
}
