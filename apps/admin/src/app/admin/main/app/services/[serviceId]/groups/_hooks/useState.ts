import { DataGridState } from '@shared/frontend';

export interface State extends DataGridState<any> {}

export const useState = () => {
  const state: State = {
    selectedKeys: [],
  };

  return state;
};
