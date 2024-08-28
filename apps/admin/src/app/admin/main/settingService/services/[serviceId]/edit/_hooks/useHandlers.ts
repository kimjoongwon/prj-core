import { useQueries } from './useQueries';
import { useParams } from 'next/navigation';
import { useState } from './useState';
import { galaxy } from '@shared/frontend';
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
        serviceId: serviceId,
        data: { ...state.form },
      });
    } else {
      createService({
        data: { name: state.form.name!, label: state.form.label || '' },
      });
    }

    refreshService();

    galaxy.router.push({
      url: '/admin/auth',
      params: {
        serviceId: 'new',
      },
    });
  };

  const onClickCancel = () => {
    galaxy.router.back();
  };

  return {
    onClickCancel,
    onClickSave,
  };
};
