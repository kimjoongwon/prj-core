import { TableBuilder } from '@shared/types';

export const getAssignmentTable = (): TableBuilder => {
  return {
    columns: [
      {
        accessorKey: 'assignment.user.name',
        header: {
          name: '이름',
        },
      },
    ],
  };
};
