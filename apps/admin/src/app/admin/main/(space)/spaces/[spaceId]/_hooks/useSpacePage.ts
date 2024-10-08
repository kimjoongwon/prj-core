import { useQueries } from './useQueries';

export const useSpacePage = () => {
  const { space } = useQueries();

  return {
    space,
  };
};
