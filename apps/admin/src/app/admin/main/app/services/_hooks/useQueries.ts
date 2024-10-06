import { useGetAllService } from '@shared/frontend';

export const useQueries = () => {
  return {
    getAllService: useGetAllService(),
  };
};
