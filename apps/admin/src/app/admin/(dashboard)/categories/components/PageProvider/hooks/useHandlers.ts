import { isArray } from 'lodash-es';
import { useState } from './useState';
import { useCoCRouter } from '@hooks';
import { Key } from 'react';

export const useHandlers = (state: ReturnType<typeof useState>) => {
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
