import { useState } from './useState';
import { useContext } from './useContext';
import { toJS } from 'mobx';
import { galaxy } from '../../../../providers/App';
import { useMutations } from './useMutations';
import { revalidatePathGetSpacesByQuery } from '../../../../actions';

export const useHandlers = (props: {
  state: ReturnType<typeof useState>;
  context: ReturnType<typeof useContext>;
  data: ReturnType<typeof useMutations>;
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

    revalidatePathGetSpacesByQuery({});
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
