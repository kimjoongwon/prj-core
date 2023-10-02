import { useCoCRouter } from '@hooks';
import { GroupButton } from '@kimjwally/ui';
import { UsersPageState } from '..';
import { Key } from 'react';
import { isArray } from 'lodash-es';

export const useMeta = (state: UsersPageState) => {
  const { getUrlWithParams, push } = useCoCRouter();

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
  ];

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
  ];
  const onSortChange = (sorting: { key: string; value: 'asc' | 'desc' }) => {
    state.table.sorting.key = sorting.key;
    state.table.sorting.value = sorting.value;
  };

  const onSelectionChange = (rowId: Key | Key[]) => {
    if (isArray(rowId)) {
      push({
        url: '/admin/dashboard/users/:userId/edit',
        params: {
          userId: rowId,
        },
      });
    }
  };

  return {
    table: {
      leftButtons,
      rightButtons,
      onSelectionChange,
      onSortChange,
    },
  };
};
