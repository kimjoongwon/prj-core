'use client';

import { TableProps } from '@nextui-org/react';
import { DataGrid, DataGridState } from '../../ui';
import { useUsersTables } from './_hooks/useUsersTable';
import { UserDto } from '../../../model';

export interface UsersTableProps extends TableProps {
  users: UserDto[];
  state: DataGridState;
}

export const UsersTable = (props: UsersTableProps) => {
  const { users = [], state, ...rest } = props;
  const { columns, leftButtons } = useUsersTables(props);

  return (
    <DataGrid
      {...rest}
      leftButtons={leftButtons}
      data={users}
      columns={columns}
      state={state}
    />
  );
};
