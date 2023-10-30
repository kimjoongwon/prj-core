import { useParams } from 'next/navigation';
import { useHandlers } from './useHandlers';
import { useSchemas } from './useSchema';
import { useState } from './useStates';

export const useMeta = (
  context: ReturnType<typeof useState> &
    ReturnType<typeof useHandlers> &
    ReturnType<typeof useSchemas>,
) => {
  const {
    serviceSchema,
    createServiceInput,
    onClickCancel,
    onClickSave,
    updateServiceInput,
  } = context;
  const { serviceId } = useParams();
  const isEditMode = serviceId !== 'new';

  return {
    isEditMode,
    form: {
      schema: serviceSchema,
      state: isEditMode ? updateServiceInput : createServiceInput,
      buttons: {
        onClickSave,
        onClickCancel,
      },
    },
  };
};
