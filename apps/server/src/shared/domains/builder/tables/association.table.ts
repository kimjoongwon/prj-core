import { TableBuilder } from '@shared/types';

export const getAssociationTable = (): TableBuilder => {
  return {
    columns: [
      {
        accessorKey: 'association.user.name',
        header: {
          name: '이름',
        },
      },
    ],
  };
};
