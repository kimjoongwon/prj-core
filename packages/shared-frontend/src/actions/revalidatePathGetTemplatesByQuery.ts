'use server';

import { revalidatePath } from 'next/cache';
import { getGetTemplatesByQueryQueryKey } from '../apis';
import { GetTemplatesByQueryParams } from '../model/getTemplatesByQueryParams';

export const revalidatePathGetTemplatesByQuery = (
  params?: GetTemplatesByQueryParams,
) => {
  // @ts-ignore
  const searchParams = new URLSearchParams(params).toString();
  const [queryKey] = getGetTemplatesByQueryQueryKey(params);
  revalidatePath(queryKey + searchParams);
};
