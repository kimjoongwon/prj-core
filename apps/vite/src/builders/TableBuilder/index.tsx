import { DataGrid, HStack } from '@shared/frontend';
import { TableBuilder as TableBuilderInterface } from '@shared/types';
import { toJS } from 'mobx';
import { CellBuilder } from '../CellBuilder';
import { HeaderBuilder } from '../HeaderBuilder';
import { ColumnDef } from '@tanstack/react-table';
import { ButtonBuilder } from '../ButtonBuilder';
import { v4 } from 'uuid';

interface TableBuilderProps {
  tableBuilder: TableBuilderInterface;
  data: (unknown & { id: string })[];
}

export const TableBuilder = ({ tableBuilder, data }: TableBuilderProps) => {
  const columns = tableBuilder?.columns.map(column => {
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
    <>
      <HStack>
        {tableBuilder.buttons?.map(button => {
          return <ButtonBuilder key={v4()} buttonBuilder={button} />;
        })}
      </HStack>
      <DataGrid data={toJS(data || [])} columns={toJS(columns) || []} />
    </>
  );
};
