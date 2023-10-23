import { useStates } from './useStates';

export const useHandlers = (state: ReturnType<typeof useStates>) => {
  const onClickSorting = (sorting: { key: any; value: any }) => {
    state.query.sortingKey = sorting.key;
    state.query.sortingValue = sorting.value;
  };

  const onClickRow = (rowIds: string[]) => {
    console.log(rowIds);
    state.table.selectedRowIds = state.table.selectedRowIds.concat(
      rowIds as never[],
    );
    console.log(state.table.selectedRowIds);
  };

  return {
    onClickRow,
    onClickSorting,
  };
};
