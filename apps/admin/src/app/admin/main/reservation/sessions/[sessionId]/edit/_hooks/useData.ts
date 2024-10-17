import {
  useCreateSession,
  useGetSession,
  useUpdateSession,
} from '@shared/frontend';
import { useContext } from './useContext';

export const useData = (props: { context: ReturnType<typeof useContext> }) => {
  const {
    context: {
      params: { sessionId },
      isEditMode,
    },
  } = props;

  const { data: getSessionResponse } = useGetSession(sessionId, {
    query: {
      enabled: isEditMode,
    },
  });

  return {
    getSessionResponse: getSessionResponse,
    createSession: useCreateSession(),
    updateSession: useUpdateSession(),
  };
};
