import { CreateSpaceDto, galaxy, UpdateSpaceDto } from '@shared/frontend';
import { useData } from './useData';
import { useState } from './useState';
import { useContext } from './useContext';

export const useHandlers = (props: {
  context: ReturnType<typeof useContext>;
  state: ReturnType<typeof useState>;
  data: ReturnType<typeof useData>;
}) => {
  const {
    context: {
      params: { serviceId, spaceId },
      isEditMode,
    },
    state,
    data: { createSpace, updateSpace },
  } = props;

  const update = () => {
    updateSpace.mutateAsync({
      spaceId,
      data: state.form as UpdateSpaceDto,
    });
  };

  const create = () => {
    createSpace.mutateAsync({ data: state.form as CreateSpaceDto });
  };

  const goBack = () => {
    galaxy.router.back();
  };

  const onClickSave = () => {
    if (isEditMode) {
      update();
    } else {
      create();
    }

    goBack();
  };

  const onClickList = () => {
    goBack();
  };

  return {
    onClickSave,
    onClickList,
  };
};
