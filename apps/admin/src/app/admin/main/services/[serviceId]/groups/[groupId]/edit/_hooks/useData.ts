import { useCreateGroup, useGetGroup, useUpdateGroup } from '@shared/frontend';
import { useContext } from './useContext';

export const useData = (props: { context: ReturnType<typeof useContext> }) => {
  const {
    context: { groupId, isEditMode },
  } = props;

  return {
    createGroup: useCreateGroup(),
    updateGroup: useUpdateGroup(),
    getGroup: useGetGroup(groupId, {
      query: {
        enabled: isEditMode,
      },
    }),
  };
};
