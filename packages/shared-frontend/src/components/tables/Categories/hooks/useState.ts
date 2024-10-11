import { useLocalObservable } from 'mobx-react-lite';
import { DataGridState } from '../../../ui/DataGrid';
import { CategoriesTableProps } from '..';

export const useState = (context: { props?: CategoriesTableProps }) => {
  const { props } = context;

  if (props.state.query) {
    return props.state;
  }

  const state = useLocalObservable<DataGridState>(() => ({
    selectedKeys: [],
  }));

  return state;
};
