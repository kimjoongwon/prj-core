import {
  CreateSessionDto,
  galaxy,
  revalidatePathGetSessionsByQuery,
  UpdateSessionDto,
} from '@shared/frontend';
import { useData } from './useData';
import { useState } from './useState';
import { useContext } from './useContext';
import { remove } from 'lodash-es';
import R from 'remeda';

export const useHandlers = (props: {
  context: ReturnType<typeof useContext>;
  state: ReturnType<typeof useState>;
  data: ReturnType<typeof useData>;
}) => {
  const {
    context: {
      params: { sessionId },
      isEditMode,
    },
    state,
    data: { createSession, updateSession },
  } = props;

  const { local, ...form } = state.form;

  const update = () => {
    updateSession.mutateAsync({
      sessionId,
      data: form as UpdateSessionDto,
    });
  };

  const create = async () => {
    await createSession.mutateAsync({
      data: state.form as CreateSessionDto,
    });
    revalidatePathGetSessionsByQuery({});
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
