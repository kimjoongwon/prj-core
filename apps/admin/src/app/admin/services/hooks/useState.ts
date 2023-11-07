import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  return useLocalObservable(() => ({
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
    table: {
      selectedRowIds: [],
    },
  }));
};
