'use client';

import { CustomDataGridProps, DataGrid } from '../../ui';
import { useUsersTables } from './_hooks/useUsersTable';
import { UserDto } from '../../../model';
import { observer } from 'mobx-react-lite';
import { CustomTable } from '../../../types';

export interface UsersTableProps extends CustomDataGridProps, CustomTable {
  users: UserDto[];
}

export const UsersTable = observer((props: UsersTableProps) => {
  const { users = [], state, standalone, ...rest } = props;
  const { columns, queries } = useUsersTables(props);

  return (
    <DataGrid
      {...rest}
      data={standalone ? queries.users : users}
      columns={columns}
      state={state}
    />
  );
});
