import { TableBuilder } from '@shared/types';

export const getAssociationTable = (): TableBuilder => {
  return {
    query: {
      name: 'useGetAssociationsByQuery',
      mapper: {
        serviceId: 'serviceId',
        groupId: 'groupId',
      },
    },
    columns: [
      {
        accessorKey: 'user.name',
        header: {
          name: '이름',
        },
      },
      {
        id: 'actions',
        header: {
          name: '액션',
        },
        cell: {
          buttons: [
            {
              name: '삭제',
              mutation: {
                name: 'deleteAssociation',
                idMapper: 'id',
              },
            },
          ],
        },
      },
    ],
  };
};
