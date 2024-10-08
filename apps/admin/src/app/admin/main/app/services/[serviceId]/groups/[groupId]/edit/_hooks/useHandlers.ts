import { CreateGroupDto, galaxy, UpdateGroupDto } from '@shared/frontend';
import { useContext } from './useContext';
import { useData } from './useData';
import { useState } from './useState';

export const useHandlers = (props: {
  context: ReturnType<typeof useContext>;
  data: ReturnType<typeof useData>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    context: { isEditMode, groupId },
    state,
    data: { createGroup, updateGroup },
  } = props;

  const create = () => {
    createGroup.mutateAsync({ data: state.form as CreateGroupDto });
  };

  const modify = () => {
    updateGroup.mutateAsync({ groupId, data: state.form as UpdateGroupDto });
  };

  const onClickSave = async () => {
    if (isEditMode) {
      modify();
    } else {
      create();
    }
    galaxy.router.back();
  };

  const onClickList = () => {
    galaxy.router.back();
  };

  return {
    onClickSave,
    onClickList,
  };
};
