import { ColumnDef } from '@tanstack/react-table';
import { ButtonGroup, Pagination, Spinner } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { v4 } from 'uuid';
import { toJS } from 'mobx';
import {
  DataGrid,
  HStack,
  VStack,
  Text,
  useApiQuery,
} from '@shared/frontend';
import { DataGridBuilderProps } from '@shared/types';
import { CellBuilder } from '../CellBuilder';
import { HeaderBuilder } from '../HeaderBuilder';
import { ButtonBuilder } from '../ButtonBuilder';
import { usePage } from '../../../provider';

export const DataGridBuilder = observer(
  ({ table, buttons }: DataGridBuilderProps) => {
    const page = usePage();
    const state = page.state;
    const { data, isLoading, meta, skip, take, setSkip, setTake } =
      useApiQuery({
        type: 'table',
        query: table.query || { name: '', params: {} },
        pagination: {
          enabled: true,
          defaultTake: table.query?.params?.take || 10,
        },
      });

    console.log('[DataGridBuilder] Query result:', { 
      dataCount: data?.length, 
      meta, 
      skip, 
      take, 
      isLoading,
      queryName: table.query?.name,
      queryParams: table.query?.params
    });

    const columns = table?.columns?.map(column => {
      return {
        id: column.id,
        accessorKey: column.accessorKey,
        header: props => {
          return <HeaderBuilder {...props} {...column.header} />;
        },
        cell: props => {
          return <CellBuilder {...props} {...column.cell} />;
        },
      } as ColumnDef<any, any>;
    });

    if (isLoading) {
      return <Spinner />;
    }

    const currentPage = Math.floor((skip || 0) / (take || 10)) + 1;

    console.log('[DataGridBuilder] Pagination info:', { 
      currentPage, 
      skip, 
      take, 
      pageCount: meta?.pageCount,
      showPagination: !!(take && meta?.pageCount && meta.pageCount > 1)
    });

    return (
      <VStack className="gap-6">
        {page?.name && (
          <Text variant="h1" className="text-xl font-semibold text-foreground">
            {page.name}
          </Text>
        )}
        <HStack>
          <ButtonGroup size="sm">
            {buttons?.map(button => {
              return <ButtonBuilder key={v4()} {...button} />;
            })}
          </ButtonGroup>
        </HStack>
        <DataGrid
          state={state?.dataGrid}
          data={toJS(data || [])}
          columns={toJS(columns) || []}
          selectionMode={table?.selectionMode}
        />
        {(take && meta?.pageCount && meta.pageCount > 1) && (
          <Pagination
            total={meta?.pageCount ?? 1}
            initialPage={currentPage}
            page={currentPage}
            onChange={async page => {
              setSkip?.((page - 1) * (take || 10));
              setTake?.(take || 10);
            }}
          />
        )}
      </VStack>
    );
  },
);
