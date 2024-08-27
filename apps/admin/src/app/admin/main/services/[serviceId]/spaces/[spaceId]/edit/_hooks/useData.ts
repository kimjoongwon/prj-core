import { useCreateSpace, useGetSpace, useUpdateSpace } from '@shared/frontend';
import { useContext } from './useContext';

export const useData = (props: { context: ReturnType<typeof useContext> }) => {
  const {
    context: {
      params: { serviceId },
      isEditMode,
    },
  } = props;

  const getSpace = useGetSpace(serviceId, {
    query: {
      enabled: isEditMode,
    },
  });

  return {
    getSpace: getSpace,
    createSpace: useCreateSpace(),
    updateSpace: useUpdateSpace(),
  };
};
