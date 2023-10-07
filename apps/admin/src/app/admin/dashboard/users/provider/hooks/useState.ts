import { User } from '@__generated__/graphql';
import { QuerySorting, TableState } from '@coc/ui';
import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  return useLocalObservable<TableState<User> & QuerySorting>(() => ({
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
