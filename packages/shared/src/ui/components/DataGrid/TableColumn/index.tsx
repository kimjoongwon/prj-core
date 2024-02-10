;

import { observer } from 'mobx-react-lite';
import { TableColumn as BaseTableColumn } from '@nextui-org/react';
import { ContainerProps } from '../../../../model';

interface TableColumnProps<T> extends ContainerProps {
  state: T;
}

export const TableColumn = observer(<T extends any>(props: TableColumnProps<T>) => {
  const { state, children } = props;
  return <BaseTableColumn allowsSorting={true}>{children}</BaseTableColumn>;
});
