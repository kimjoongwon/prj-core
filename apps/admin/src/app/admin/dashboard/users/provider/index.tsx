'use client';

import { ContainerProps, TableState } from '@kimjwally/ui';
import { useCoCTable, useState, useUsersQuery } from '@hooks';
import { GetUsersQuery, User } from '@__generated__/graphql';
import { createContext } from 'react';
import { useMeta } from './hooks/useMeta';
import { Table } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { cloneDeep } from 'lodash-es';
import { useUsersColumns } from '@columns';

export interface UsersPageState {
  table: TableState;
}

interface UsersPageQuery {
  data: GetUsersQuery;
}
interface Page {
  query: UsersPageQuery;
  state: UsersPageState;
  meta: ReturnType<typeof useMeta>;
  table: Table<User>;
}

export const UsersPageContext = createContext<Page>({} as Page);

export const UsersPageProvider = observer((props: ContainerProps) => {
  const { children } = props;

  const state = useState<UsersPageState>({
    table: {
      pagination: {
        skip: 0,
        take: 10,
      },
      sorting: {
        key: undefined,
        value: undefined,
      },
    },
  });

  const query = useUsersQuery({
    skip: state.table.pagination.skip,
    take: state.table.pagination.take,
    sortingKey: state.table.sorting.key,
    sortingValue: state.table.sorting.value,
  });

  const columns = useUsersColumns();

  const table = cloneDeep(
    useCoCTable<User>({
      data: query.data?.users?.nodes || [],
      columns,
    }),
  );

  const meta = useMeta(state);

  return (
    <UsersPageContext.Provider
      value={{
        query,
        state,
        meta,
        table,
      }}
    >
      {children}
    </UsersPageContext.Provider>
  );
});
