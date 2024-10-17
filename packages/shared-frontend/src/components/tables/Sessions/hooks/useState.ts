import { useLocalObservable } from 'mobx-react-lite';
import { DataGridState } from '../../../ui/DataGrid';

export const useState = () => {
  const state = useLocalObservable<DataGridState<any>>(() => ({
    selectedKeys: [],
    take: 10,
    skip: 0,
  }));

  return state;
};
