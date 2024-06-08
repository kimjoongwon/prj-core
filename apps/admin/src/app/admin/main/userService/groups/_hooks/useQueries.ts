import { useFindGroupsByPageOptions } from '@shared/frontend';

export const useQueries = () => {
  const { data: findGroupsByPageOptionsQueryData } =
    useFindGroupsByPageOptions();

  const groups = findGroupsByPageOptionsQueryData?.data || [];
  return { 
    groups,
  };
};