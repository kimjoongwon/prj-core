import { useLocalObservable } from 'mobx-react-lite';
import { DataGridState } from '../../../ui/DataGrid';
import { CategoriesTableProps } from '..';

export const useState = (context: { props?: CategoriesTableProps }) => {
  const { props } = context;
  const state = useLocalObservable<DataGridState>(() => ({
    selectedKeys: [],
    skip: 0,
    take: 5,
    ...props?.state,
  }));

  return state;
};
