import { TableBuilder } from '@shared/types';
import { getUserColumn } from '../columns/user-columns';

export const getUserTable = (tableBuilder?: TableBuilder): TableBuilder => {
  return {
    query: {
      name: 'useGetUsersByQuery',
      hasParams: true,
    },
    columns: getUserColumn(),
    ...tableBuilder,
  };
};
