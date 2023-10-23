import { useLocalObservable } from 'mobx-react-lite';

export const useStates = () => {
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
