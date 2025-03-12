import { PageTypeParams } from '@shared/types';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  getCreateGymMutationOptions,
  getUpdateGymMutationOptions,
} from '@shared/frontend';
import { useState } from './useState';
import { cloneDeep } from 'lodash-es';
import { addToast } from '@heroui/react';
import { AxiosError } from 'axios';

export const useHandlers = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  const router = useRouter();
  const { type, gymId } = useParams<PageTypeParams & { gymId: string }>();
  const { mutateAsync: createGym } = useMutation(getCreateGymMutationOptions());
  const { mutateAsync: updateGym } = useMutation(getUpdateGymMutationOptions());
  const formInputs = cloneDeep(state.form.inputs);

  const goBack = () => router.back();
  const onSuccess = () =>
    addToast({
      color: 'success',
      title: '안내',
      description: '저장되었습니다.',
    });

  const onFailure = (e: AxiosError) =>
    addToast({
      color: 'danger',
      title: '안내',
      description: '저장에 실패했습니다.',
    });

  const create = () => {
    createGym({
      data: formInputs,
    })
      .then(onSuccess)
      .then(goBack)
      .catch(onFailure);
  };

  const update = () => {
    updateGym({
      gymId,
      data: formInputs,
    })
      .then(onSuccess)
      .then(goBack)
      .catch(onFailure);
  };

  const onPressSave = () => {
    if (gymId === 'new') {
      create();
      return;
    }

    if (type === 'edit') {
      update();
      return;
    }
  };
  const onPressList = () => goBack();

  return {
    onPressSave,
    onPressList,
  };
};
