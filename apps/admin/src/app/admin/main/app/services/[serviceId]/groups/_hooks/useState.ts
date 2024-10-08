import { DataGridState } from '@shared/frontend';

export interface State extends DataGridState {}

export const useState = () => {
  const state: State = {
    selectedKeys: [],
  };

  return state;
};
