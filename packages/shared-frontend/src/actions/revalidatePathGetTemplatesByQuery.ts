'use server';

import { revalidatePath } from 'next/cache';
import { getGetTemplatesByQueryQueryKey } from '../apis';
import { GetTemplatesByQueryParams } from '../model/getTemplatesByQueryParams';

export const revalidatePathGetTemplatesByQuery = (
  params?: GetTemplatesByQueryParams,
) => {
  if (!params) {
    return null;
  }
  const searchParams = new URLSearchParams(JSON.stringify(params)).toString();
  const [queryKey] = getGetTemplatesByQueryQueryKey(params);
  revalidatePath(queryKey + searchParams);
};
