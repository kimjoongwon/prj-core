import {
  CreateTimelineItemDto,
  galaxy,
  revalidatePathGetTimelineItemsByQuery,
  UpdateTimelineItemDto,
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
      params: { timelineItemId },
      isEditMode,
    },
    state,
    data: { createTimelineItem, updateTimelineItem },
  } = props;

  const update = () => {
    updateTimelineItem.mutateAsync({
      timelineItemId,
      data: state.form as UpdateTimelineItemDto,
    });
  };

  const create = async () => {
    await createTimelineItem.mutateAsync({
      data: state.form as CreateTimelineItemDto,
    });
    revalidatePathGetTimelineItemsByQuery({});
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
