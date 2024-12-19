import { DataGrid } from '@shared/frontend';
import { PageBuilder } from '@shared/types';
import { toJS } from 'mobx';
import { CellBuilder } from '../CellBuilder';
import { HeaderBuilder } from '../HeaderBuilder';
import { ColumnDef } from '@tanstack/react-table';

interface TableBuilderProps {
  state: PageBuilder;
  data: (unknown & { id: string })[];
}

export const TableBuilder = ({ state, data }: TableBuilderProps) => {
  const columns = state?.table?.columns.map(column => {
    return {
      id: column.id,
      accessorKey: column.accessorKey,
      header: props => {
        return <HeaderBuilder {...props} {...column.header} />;
      },
      cell: props => <CellBuilder {...props} {...column.cell} />,
    } as ColumnDef<unknown & { id: string }, unknown>;
  });
  console.log('data', data);
  return <DataGrid data={toJS(data || [])} columns={toJS(columns) || []} />;
};
