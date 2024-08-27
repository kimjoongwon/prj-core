import { galaxy } from '@shared/frontend';
import { useState } from './useState';
import { useContext } from './useContext';
import { useData } from './useData';
import { toJS } from 'mobx';

export const useHandlers = (props: {
  state: ReturnType<typeof useState>;
  context: ReturnType<typeof useContext>;
  data: ReturnType<typeof useData>;
}) => {
  const {
    state,
    context: {
      params: { serviceId },
    },
    data: { removeSpaces },
  } = props;

  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/services/:serviceId/spaces/:spaceId/edit',
      params: {
        serviceId,
        spaceId: 'new',
      },
    });
  };

  const onClickRemove = () => {
    const spaceIds = toJS(state.selectedKeys);
    removeSpaces.mutateAsync({
      data: {
        spaceIds: spaceIds,
      },
    });
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
