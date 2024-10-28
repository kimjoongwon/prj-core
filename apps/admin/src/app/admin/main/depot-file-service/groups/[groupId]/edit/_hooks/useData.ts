import {
  useCreateGroup,
  useGetGroupSuspense,
  useUpdateGroup,
} from '@shared/frontend';
import { useContext } from './useContext';

export const useData = (props: { context: ReturnType<typeof useContext> }) => {
  const {
    context: { groupId },
  } = props;

  return {
    createGroup: useCreateGroup(),
    updateGroup: useUpdateGroup(),
    getGroup: useGetGroupSuspense(groupId),
  };
};
