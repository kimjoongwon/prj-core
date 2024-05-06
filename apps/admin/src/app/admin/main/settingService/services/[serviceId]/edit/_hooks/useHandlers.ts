import { router } from '@shared/frontend';
import { useQueries } from './useQueries';
import { useParams } from 'next/navigation';
import { useState } from './useState';
export const useHandlers = ({
  queries: { createService, refreshService, updateService, service },
  state,
}: {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
}) => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const isEditMode = serviceId !== 'new';

  const onClickSave = () => {
    if (isEditMode) {
      updateService({
        id: serviceId,
        data: { ...state.form },
      });
    } else {
      createService({
        data: { name: state.form.name!, label: state.form.label || '' },
      });
    }

    refreshService();

    router.push({
      url: '/admin/main/settingService/services',
      params: {
        serviceId: 'new',
      },
    });
  };

  const onClickCancel = () => {
    router.back();
  };

  return {
    onClickCancel,
    onClickSave,
  };
};
