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
    data: { removeTimelineItems },
  } = props;

  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/reservation/timelineItems/:timelineItemId/edit',
      params: {
        timelineItemId: 'new',
      },
    });
  };

  const onClickRemove = () => {
    const timelineItemIds = toJS(state.selectedKeys);
    removeTimelineItems.mutateAsync({ data: timelineItemIds });
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
