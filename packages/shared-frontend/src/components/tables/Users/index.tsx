'use client';

import { CustomDataGridProps, DataGrid } from '../../ui';
import { useUsersTables } from './_hooks/useUsersTable';
import { UserDto } from '../../../model';
import { observer } from 'mobx-react-lite';

export interface UsersTableProps extends CustomDataGridProps {
  users: UserDto[];
}

export const UsersTable = observer((props: UsersTableProps) => {
  const { users = [], state, ...rest } = props;
  const { columns } = useUsersTables(props);

  return <DataGrid {...rest} data={users} columns={columns} state={state} />;
});
