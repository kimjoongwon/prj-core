import { useCoCRouter } from '@hooks';
import { useParams } from 'next/navigation';
import { useMutations } from './useMutations';
import { useState } from './useStates';

export const useHandlers = (
  context: ReturnType<typeof useMutations> & ReturnType<typeof useState>,
) => {
  const {
    createService,
    updateService,
    createServiceInput,
    updateServiceInput,
  } = context;
  const { id } = useParams();
  const router = useCoCRouter();

  const onClickSave = async () => {
    if (id === 'new') {
      return await createService({
        variables: {
          createServiceInput,
        },
      });
    }
    return await updateService({
      variables: {
        updateServiceInput,
      },
    });
  };

  const onClickCancel = () => {
    router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
