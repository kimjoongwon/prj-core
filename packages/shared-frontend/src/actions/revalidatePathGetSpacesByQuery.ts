'use server';

import { revalidatePath } from 'next/cache';
import { getGetSpacesByQueryQueryKey } from '../apis';
import { GetSpacesByQueryParams } from '../model/getSpacesByQueryParams';

export const revalidatePathGetSpacesByQuery = (
  params: GetSpacesByQueryParams,
) => {
  // @ts-ignore
  const searchParams = new URLSearchParams(params).toString();
  const [queryKey] = getGetSpacesByQueryQueryKey(params);
  revalidatePath(queryKey + searchParams);
};
