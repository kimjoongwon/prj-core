'use server';

import { revalidatePath } from 'next/cache';
import { getGetSessionsByQueryQueryKey } from '../apis';
import { GetSessionsByQueryParams } from '../model/getSessionsByQueryParams';

export const revalidatePathGetSessionsByQuery = (
  params: GetSessionsByQueryParams,
) => {
  // @ts-ignore
  const searchParams = new URLSearchParams(params).toString();
  const [queryKey] = getGetSessionsByQueryQueryKey(params);
  revalidatePath(queryKey + searchParams);
};
