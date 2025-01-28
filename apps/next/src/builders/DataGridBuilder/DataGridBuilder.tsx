import { DataGrid, HStack } from '@shared/frontend';
import { DataGridBuilder as DataGridBuilderInterface } from '@shared/types';
import { CellBuilder } from '../CellBuilder';
import { HeaderBuilder } from '../HeaderBuilder';
import { ColumnDef } from '@tanstack/react-table';
import { ButtonBuilder } from '../ButtonBuilder';
import { ButtonGroup, Pagination, Spinner } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { useGetTableQuery } from '../../hooks/useGetTableQuery';
import { v4 } from 'uuid';
import { toJS } from 'mobx';
import { usePageState } from '../Page/PageBuilder';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface DataGridBuilderProps {
  dataGridBuilder: DataGridBuilderInterface;
}

export const DataGridBuilder = observer(
  ({ dataGridBuilder }: DataGridBuilderProps) => {
    const table = dataGridBuilder?.table!;
    const pageState = usePageState();
    const { data, isLoading, meta } = useGetTableQuery(table);
    // const urlSearchParams = new URLSearchParams(table?.query?.params);
    const searchParams = useSearchParams();

    const columns = table?.columns?.map(column => {
      return {
        id: column.id,
        accessorKey: column.accessorKey,
        header: props => {
          return <HeaderBuilder {...props} {...column.header} />;
        },
        cell: props => <CellBuilder {...props} {...column.cell} />,
      } as ColumnDef<unknown & { id: string }, unknown>;
    });

    if (isLoading) {
      return <Spinner />;
    }

    const skip = Number(searchParams.get('skip'));
    const take = Number(searchParams.get('take'));
    const currentPage = Math.floor(skip / take) + 1;

    return (
      <>
        <HStack>
          <ButtonGroup size="sm">
            {dataGridBuilder.buttons?.map(button => {
              return <ButtonBuilder key={v4()} buttonBuilder={button} />;
            })}
          </ButtonGroup>
        </HStack>
        <DataGrid
          state={pageState?.dataGrid}
          data={toJS(data || [])}
          columns={toJS(columns) || []}
          selectionMode={table.selectionMode}
        />
        {/* {table?.query?.params?.take && (
          <Pagination
            total={meta?.pageCount ?? 1}
            initialPage={currentPage}
            page={currentPage}
            onChange={page => {
              searchParams.set('take', take.toString());
              searchParams.set('skip', ((page - 1) * take).toString());
              setSearchParams(searchParams);
            }}
          />
        )} */}
      </>
    );
  },
);
