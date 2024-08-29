import { useLocalObservable } from 'mobx-react-lite';
import { DataGridState } from '../../../ui/DataGrid';

export const useState = () => {
  const state = useLocalObservable<DataGridState>(() => ({
    selectedKeys: [],
  }));

  return state;
};
