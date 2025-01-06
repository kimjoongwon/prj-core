import { PageBuilder } from '@shared/types';
import { getAssociationTable } from '../tables/association.table';

export const getAssociationsPage = (): PageBuilder => {
  return {
    name: '할딩',
    type: 'Page',
    dataGrid: {
      table: getAssociationTable(),
    },
  };
};
