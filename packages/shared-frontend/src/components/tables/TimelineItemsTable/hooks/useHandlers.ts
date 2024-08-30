import { useState } from './useState';
import { useContext } from './useContext';
import { toJS } from 'mobx';
import { galaxy } from '../../../../providers/App';
import { useMutations } from './useMutations';
import { revalidatePathGetTimelineItemsByQuery } from '../../../../actions';

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
    data: { removeTimelineItems },
  } = props;

  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/services/:serviceId/timelineItems/:timelineItemId/edit',
      params: {
        serviceId,
        timelineItemId: 'new',
      },
    });
  };

  const onClickRemove = () => {
    const timelineItemIds = toJS(state.selectedKeys);
    removeTimelineItems.mutateAsync({ data: timelineItemIds });

    revalidatePathGetTimelineItemsByQuery();
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
