import { redirect } from 'next/navigation';

import { StopListScreen } from '@/features/stop-list/ui/StopListScreen';
import {
  filtersFromSearchParamsRecord,
  filtersToSearchParams,
} from '@/features/stop-list/model/filters';

export default async function Home({ searchParams }: PageProps<'/'>) {
  const rawParams = await searchParams;
  const rawShop = Array.isArray(rawParams.shop) ? rawParams.shop[0] : rawParams.shop;
  const rawStatus = Array.isArray(rawParams.status) ? rawParams.status[0] : rawParams.status;

  const normalized = filtersFromSearchParamsRecord(rawParams);
  const isInvalid =
    (rawShop !== undefined && rawShop !== normalized.shop) ||
    (rawStatus !== undefined && rawStatus !== normalized.status);

  if (isInvalid) {
    const query = filtersToSearchParams(normalized).toString();
    redirect(query ? `/?${query}` : '/');
  }

  return <StopListScreen />;
}
