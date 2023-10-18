import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  return useLocalObservable(() => ({
    test: {
      checked: false,
    },
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
