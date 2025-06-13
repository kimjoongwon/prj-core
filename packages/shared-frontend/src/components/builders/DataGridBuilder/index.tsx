import { ColumnDef } from '@tanstack/react-table';
import { ButtonGroup, Pagination, Spinner } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { v4 } from 'uuid';
import { toJS } from 'mobx';
import { DataGrid, HStack, useGetTableQuery } from '@shared/frontend';
import { DataGridBuilderProps } from '@shared/types';
import { CellBuilder } from '../CellBuilder';
import { HeaderBuilder } from '../HeaderBuilder';
import { ButtonBuilder } from '../ButtonBuilder';
import { usePageState } from '../PageBuilder';
import { useGetGroundsByQuery } from '@shared/api-client';

export const DataGridBuilder = observer(
  ({ table, buttons }: DataGridBuilderProps) => {
    const pageState = usePageState();
    const { data, isLoading, meta, skip, take, setSkip, setTake } =
      useGetTableQuery(table);

    const columns = table?.columns?.map(column => {
      return {
        id: column.id,
        accessorKey: column.accessorKey,
        header: props => {
          return <HeaderBuilder {...props} {...column.header} />;
        },
        cell: props => <CellBuilder {...props} {...column.cell} />,
      } as ColumnDef<any, any>;
    });
    if (isLoading) {
      return <Spinner />;
    }

    const currentPage = Math.floor((skip || 0) / (take || 10)) + 1;

    return (
      <>
        <HStack>
          <ButtonGroup size="sm">
            {buttons?.map(button => {
              return <ButtonBuilder key={v4()} {...button} />;
            })}
          </ButtonGroup>
        </HStack>
        <DataGrid
          state={pageState?.dataGrid}
          data={toJS(data || [])}
          columns={toJS(columns) || []}
          selectionMode={table?.selectionMode}
        />
        {table?.query?.params?.take && (
          <Pagination
            total={meta?.pageCount ?? 1}
            initialPage={currentPage}
            page={currentPage}
            onChange={async page => {
              setSkip((page - 1) * (take || 10));
              setTake(take || 10);
            }}
          />
        )}
      </>
    );
  },
);
