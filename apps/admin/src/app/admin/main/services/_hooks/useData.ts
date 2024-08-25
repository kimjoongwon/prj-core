import {
  useGetAllServiceSuspense,
  useRemoveService,
  useRemoveServices,
} from '@shared/frontend';

export const useData = () => {
  return {
    getAllService: useGetAllServiceSuspense(),
    removeServices: useRemoveServices(),
  };
};
