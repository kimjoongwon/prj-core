import { createColumnHelper } from '@tanstack/react-table';
import { TemplateDto } from '../../../../model/templateDto';

export const useColumns = () => {
  const columnHelper = createColumnHelper<TemplateDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '제목',
    }),
  ];

  return columns;
};
