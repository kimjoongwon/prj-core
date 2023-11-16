import {
  useCoCRouter,
  useCreateGroup,
  useUpdateGroup,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    createGroup: useCreateGroup({
      onCompleted: () => {
        router.back();
      },
    }),
    updateGroup: useUpdateGroup({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
