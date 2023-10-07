import { isArray } from 'lodash-es';
import { useState } from './useState';
import { useCoCRouter } from '@hooks';
import { Key } from 'react';

export const useHandlers = (state: ReturnType<typeof useState>) => {
  const router = useCoCRouter();

  const onClickSorting = (sorting: { key: string; value: 'asc' | 'desc' }) => {
    state.query.sortingKey = sorting.key;
    state.query.sortingValue = sorting.value;
  };

  const onClickRow = (rowId: Key | Key[]) => {
    if (!isArray(rowId)) {
      router.push({
        url: '/admin/dashboard/users/:userId',
        params: {
          userId: rowId,
        },
      });
    }
  };

  return {
    onClickRow,
    onClickSorting,
  };
};
