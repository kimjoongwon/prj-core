import { CreateServiceDto, galaxy, UpdateServiceDto } from '@shared/frontend';
import { useData } from './useData';
import { useState } from './useState';
import { useContext } from './useContext';

export const useHandlers = (props: {
  context: ReturnType<typeof useContext>;
  state: ReturnType<typeof useState>;
  data: ReturnType<typeof useData>;
}) => {
  const {
    context: { serviceId, isEditMode },
    state,
    data: { createService, updateService },
  } = props;

  const update = () => {
    updateService.mutateAsync({
      serviceId,
      data: state.form as UpdateServiceDto,
    });
  };

  const create = () => {
    createService.mutateAsync({ data: state.form as CreateServiceDto });
  };

  const onClickSave = () => {
    if (isEditMode) {
      update();
    } else {
      create();
    }

    galaxy.router.push({
      url: '/admin/main/services',
    });
  };

  const onClickList = () => {
    galaxy.router.push({
      url: '/admin/main/services',
      params: {
        serviceId: serviceId,
      },
    });
  };

  return {
    onClickSave,
    onClickList,
  };
};
