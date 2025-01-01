import { TableBuilder } from '@shared/types';
import { getUserColumn } from '../columns/user-columns';

export const getUserTable = (): TableBuilder => {
  return {
    query: {
      name: 'useGetUsersByQuery',
      hasParams: true,
    },
    state: {
      pagination: {
        skip: 0,
        take: 1,
      },
    },
    columns: getUserColumn(),
  };
};
