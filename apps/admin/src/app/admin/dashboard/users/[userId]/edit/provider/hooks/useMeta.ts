import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';

export const useMeta = (context: ReturnType<typeof useMutations>) => {
  const {
    signUp: [signUp],
  } = context;

  const router = useCoCRouter();

  const onClickSave = () => {
    signUp();
  };

  const onClickCancel = () => {
    router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
