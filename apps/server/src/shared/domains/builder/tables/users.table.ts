import { TableBuilder } from '@shared/types';
import { getUserColumn } from '../columns/user-columns';

export const getUserTable = (tableBuilder?: TableBuilder): TableBuilder => {
  const userTable: TableBuilder = {
    ...tableBuilder,
    query: {
      name: 'useGetUsersByQuery',
    },
    columns: getUserColumn(tableBuilder?.columns || []),
  };

  return userTable;
};
