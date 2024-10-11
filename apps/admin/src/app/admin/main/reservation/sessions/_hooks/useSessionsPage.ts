import { useQueries } from './useQueries';
export const useSessionsPage = () => {
  const { sessions } = useQueries();
  return {
    sessions,
  };
};
