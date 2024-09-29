import {
  CreateTemplateDto,
  galaxy,
  revalidatePathGetTemplatesByQuery,
  UpdateTemplateDto,
} from '@shared/frontend';
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
      params: { templateId },
      isEditMode,
    },
    state,
    data: { createTemplate, updateTemplate },
  } = props;

  const update = () => {
    updateTemplate.mutateAsync({
      templateId,
      data: state.form as UpdateTemplateDto,
    });
  };

  const create = async () => {
    await createTemplate.mutateAsync({
      data: state.form as CreateTemplateDto,
    });
    revalidatePathGetTemplatesByQuery();
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
