import { $Enums } from '@prisma/client';
import { RouteBuilder } from '@shared/types';

export const getEntitiesRoute = (serviceName: $Enums.ServiceNames): RouteBuilder => {
  const nameConverter = {
    USER: 'Users',
    SPACE: 'Spaces',
  };

  return {
    name: '자원',
    pathname: 'entities',
    layout: {
      name: '자원',
      type: 'DataGrid',
      page: {
        dataGrid: {
          table: {
            query: {
              name: `useGet${nameConverter[serviceName]}ByQuery`,
            },
            columns: [
              {
                accessorKey: 'name',
                header: {
                  name: '이름',
                },
              },
            ],
          },
        },
      },
    },
  };
};
