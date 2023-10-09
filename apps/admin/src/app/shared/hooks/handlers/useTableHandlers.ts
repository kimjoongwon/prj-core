export interface TableState {
  query: {
    sortingKey: string;
    sortingValue: string;
  };
  table: {
    selectedRowIds: string[];
  };
}

export const useTableHandlers = <T extends TableState>(state: T) => {
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
