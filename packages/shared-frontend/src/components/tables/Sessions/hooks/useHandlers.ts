import { useState } from './useState';
import { useContext } from './useContext';
import { toJS } from 'mobx';
import { galaxy } from '../../../../providers/App';
import { useMutations } from './useMutations';

export const useHandlers = (props: {
  state: ReturnType<typeof useState>;
  context: ReturnType<typeof useContext>;
  data: ReturnType<typeof useMutations>;
}) => {
  const {
    state,
    data: { removeSessions },
  } = props;

  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/reservation/sessions/:sessionId/edit',
      params: {
        sessionId: 'new',
      },
    });
  };

  const onClickRemove = () => {
    const sessionIds = toJS(state.selectedKeys);
    removeSessions.mutateAsync({ data: sessionIds });
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
