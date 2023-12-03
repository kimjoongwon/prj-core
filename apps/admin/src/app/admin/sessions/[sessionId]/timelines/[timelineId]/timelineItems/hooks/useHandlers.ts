import { useTimelineEditPage } from '../../edit/hooks';

export const useHandlers = ({}: {}) => {
  const { state } = useTimelineEditPage();

  const onClickRow = (rowIds: string[]) => {
    console.log('rowIds', rowIds, state.selectedTimelineItemIds);
    state.selectedTimelineItemIds = rowIds;
  };

  return {
    onClickRow,
    onClickSorting: null,
  };
};
