import { useGetAllServiceSuspense } from '@shared/frontend';

export const useData = () => {
  return {
    getAllService: useGetAllServiceSuspense(),
  };
};
