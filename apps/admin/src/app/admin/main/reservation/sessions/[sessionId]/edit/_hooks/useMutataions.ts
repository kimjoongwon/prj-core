import { useCreateSession, useUpdateSession } from '@shared/frontend';

export const useMutations = () => {
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  return {
    createSession,
    updateSession,
  };
};
