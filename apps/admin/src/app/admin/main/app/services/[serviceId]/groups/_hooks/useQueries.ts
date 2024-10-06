import { useGetGroupsByQuery } from '@shared/frontend';

export const useQueries = () => {
  const getGroupsByQuery = useGetGroupsByQuery();

  return {
    getGroupsByQuery,
  };
};
