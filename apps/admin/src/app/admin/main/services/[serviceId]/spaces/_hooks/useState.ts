import { DataGridState } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  const state = useLocalObservable<DataGridState>(() => ({
    selectedKeys: [],
  }));

  return state;
};
