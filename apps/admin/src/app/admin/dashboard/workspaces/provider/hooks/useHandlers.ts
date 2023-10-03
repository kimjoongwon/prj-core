import { isArray } from 'lodash-es';
import { useState } from './useState';
import { useCoCRouter } from '@hooks';
import { Key } from 'react';

export const useHandlers = (state: ReturnType<typeof useState>) => {
  const router = useCoCRouter();

  const onClickSorting = (sorting: { key: string; value: 'asc' | 'desc' }) => {
    state.table.sorting.key = sorting.key;
    state.table.sorting.value = sorting.value;
  };

  const onClickRow = (rowId: Key | Key[]) => {
    if (!isArray(rowId)) {
      router.push({
        url: '/admin/dashboard/workspaces/:workspaceId',
        params: {
         WorkspaceId: rowId,
        },
      });
    }
  };

  return {
    onClickRow,
    onClickSorting,
  };
};
