import { observable } from 'mobx';

export const useState = () => {
  return observable({
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
  });
};
