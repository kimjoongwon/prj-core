---
to: src/app/admin/dashboard/<%= name %>/provider/hooks/useState.ts
---

import { TableState } from '@kimjwally/ui';
import { useLocalObservable } from 'mobx-react-lite';

interface State {
  table: TableState;
}

export const useState = () => {
  return useLocalObservable<State>(() => ({
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
  }));
};
