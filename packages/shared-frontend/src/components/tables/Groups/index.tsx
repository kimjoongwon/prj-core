'use client';

import { TableProps } from '@nextui-org/react';
import { GroupDto } from '../../../model/groupDto';
import { DataGrid, DataGridState } from '../../ui';
import { useGroupsTables } from './hooks/useGroupsTable';
import { observer } from 'mobx-react-lite';

export interface GroupsTableProps extends TableProps {
  groups: GroupDto[];
  state: DataGridState<any>;
}

export const GroupsTable = observer((props: GroupsTableProps) => {
  const { groups = [], state, ...rest } = props;
  const { columns, rightButtons, leftButtons } = useGroupsTables(props);

  return (
    <DataGrid
      {...rest}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
      data={groups}
      columns={columns}
      state={state}
    />
  );
});
