import { APIManager, DataGrid } from '@shared/frontend';
import { PageBuilder } from '@shared/types';
import { toJS } from 'mobx';
import { CellBuilder } from '../CellBuilder';
import { HeaderBuilder } from '../HeaderBuilder';
import { ColumnDef } from '@tanstack/react-table';

interface TableBuilderProps {
  state: PageBuilder;
}

export const TableBuilder = ({ state }: TableBuilderProps) => {
  const serviceId = window.location.pathname.split('/')[4];
  console.log('serviceId', serviceId);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { data: response } = APIManager[
    state.table?.apiKey as keyof typeof APIManager
  ](
    { ...state.table?.query, serviceId },
    {
      query: {
        enabled: !!state?.table?.apiKey,
      },
    },
  );

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

  return (
    <DataGrid data={toJS(response?.data || [])} columns={toJS(columns) || []} />
  );
};
