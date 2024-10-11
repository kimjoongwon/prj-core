import { useLocalObservable } from 'mobx-react-lite';
import { DataGridState } from '../../../ui/DataGrid';
import { SpacesTableProps } from '..';

export const useState = (context: { props: SpacesTableProps }) => {
  const { props } = context;

  const state = useLocalObservable<DataGridState>(() => ({
    selectedKeys: [],
    ...props.state,
  }));

  return state;
};
