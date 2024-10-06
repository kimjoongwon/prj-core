import {
  useCreateService,
  useGetAllService,
  useGetService,
  useUpdateService,
} from '@shared/frontend';
import { useContext } from './useContext';

export const useData = (props: { context: ReturnType<typeof useContext> }) => {
  const {
    context: { serviceId, isEditMode },
  } = props;

  const getService = useGetService(serviceId, {
    query: {
      enabled: isEditMode,
    },
  });

  return {
    getService: getService,
    getAllService: useGetAllService(),
    createService: useCreateService(),
    updateService: useUpdateService(),
  };
};
