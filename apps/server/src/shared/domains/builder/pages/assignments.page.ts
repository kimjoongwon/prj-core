import { PageBuilder } from '@shared/types';
import { getAssignmentTable } from '../tables/assignments.table';

export const getAssignmentsPage = (): PageBuilder => {
  return {
    name: '할딩',
    type: 'Page',
    dataGrid: {
      table: getAssignmentTable(),
    },
  };
};
