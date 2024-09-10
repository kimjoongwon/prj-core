'use server';

import { revalidatePath } from 'next/cache';
import { getGetTimelineItemsByQueryQueryKey } from '../apis';
import { GetTimelineItemsByQueryParams } from '../model';

export const revalidatePathGetTimelineItemsByQuery = (
  params?: GetTimelineItemsByQueryParams,
) => {
  // @ts-ignore
  const searchParams = new URLSearchParams(params).toString();
  const [queryKey] = getGetTimelineItemsByQueryQueryKey(params);
  const path = queryKey + searchParams;
  revalidatePath(path);
};
