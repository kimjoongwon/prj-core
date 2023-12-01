import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';
import { useState } from './useState';

export const useHandlers = ({
  mutations,
  state,
}: {
  mutations: ReturnType<typeof useMutations>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    createTimelineItem: [createTimelineItem],
    updateTimelineItem: [updateTimelineItem],
  } = mutations;  

  const router = useCoCRouter();
  const { timelineItemId } = useParams();

  const onClickSave = () => {
    if (timelineItemId === 'new') {
      createTimelineItem({
        variables: {
          createTimelineItemInput: state.form,
        },
      });
    } else {
      updateTimelineItem({
        variables: {
          updateTimelineItemInput: {
            id: timelineItemId as string,
            ...state.form,
          },
        },
      });
    }
  };

  const onClickCancel = () => {
    router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};

