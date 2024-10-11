import { DataGridState } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  const state = useLocalObservable<DataGridState>(() => ({
    query: {
      take: 10,
      skip: 0,
    },
  }));

  return state;
};
