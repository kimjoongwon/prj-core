import { DataGridState, GetGroupsByQueryParams } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  const state = useLocalObservable<DataGridState<GetGroupsByQueryParams>>(
    () => ({
      selectedKeys: [],
    }),
  );

  return state;
};
