import {
  useCoCRouter,
  useCreateSession,
  useUpdateSession,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    createSession: useCreateSession({
      onCompleted: () => {
        router.back();
      },
    }),
    updateSession: useUpdateSession({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
