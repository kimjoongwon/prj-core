import { useQueries } from './useQueries';

export const useGroupPage = () => {
  const queries = useQueries();
  return {
    queries,
  };
};
