'use client';

import { TableProps } from '@nextui-org/react';
import { GroupDto } from '../../../model/groupDto';
import { DataGrid, DataGridState } from '../../ui';
import { useGroupsTables } from './_hooks/useGroupsTable';

export interface GroupsTableProps extends TableProps {
  groups: GroupDto[];
  state: DataGridState;
}

export const GroupsTable = (props: GroupsTableProps) => {
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
};
