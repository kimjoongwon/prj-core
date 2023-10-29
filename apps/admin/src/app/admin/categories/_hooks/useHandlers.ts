import { useStates } from './useStates';

export const useHandlers = (state: ReturnType<typeof useStates>) => {
  const onClickSorting = (sorting: { key: any; value: any }) => {
    state.query.sortingKey = sorting.key;
    state.query.sortingValue = sorting.value;
  };

  const onClickRow = (rowIds: string[]) => {
    state.table.selectedRowIds = state.table.selectedRowIds.concat(
      rowIds as never[],
    );
  };

  return {
    onClickRow,
    onClickSorting,
  };
};
