---
to: src/app/admin/dashboard/<%= name %>/provider/hooks/useState.ts
---

import { TableState } from '@coc/ui';
import { useLocalObservable } from 'mobx-react-lite';

interface State {
  table: TableState;
}

export const useState = () => {
  return useLocalObservable<TableState<<%= Name %>> & QuerySorting>(() => ({
    search: {
      email: '',
    },
    query: {
      email: '',
      skip: 0,
      take: 10,
      sortingKey: undefined,
      sortingValue: undefined,
    },
  }));
};
