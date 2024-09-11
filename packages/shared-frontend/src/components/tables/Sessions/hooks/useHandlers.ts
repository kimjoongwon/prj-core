import { useState } from './useState';
import { useContext } from './useContext';
import { toJS } from 'mobx';
import { galaxy } from '../../../../providers/App';
import { useMutations } from './useMutations';
import { revalidatePathGetSessionsByQuery } from '../../../../actions/revalidatePathGetSessionsByQuery';

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
    data: { removeSessions },
  } = props;

  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/services/:serviceId/sessions/:sessionId/edit',
      params: {
        serviceId,
        sessionId: 'new',
      },
    });
  };

  const onClickRemove = () => {
    const sessionIds = toJS(state.selectedKeys);

    removeSessions.mutateAsync({ data: sessionIds });

    revalidatePathGetSessionsByQuery();
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
