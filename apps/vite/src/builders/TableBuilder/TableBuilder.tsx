import { DataGrid, HStack } from '@shared/frontend';
import { TableBuilder as TableBuilderInterface } from '@shared/types';
import { reaction, toJS } from 'mobx';
import { CellBuilder } from '../CellBuilder';
import { HeaderBuilder } from '../HeaderBuilder';
import { ColumnDef } from '@tanstack/react-table';
import { ButtonBuilder } from '../ButtonBuilder';
import { v4 } from 'uuid';
import { ButtonGroup, Pagination, Spinner } from '@nextui-org/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { createContext, useContext, useEffect, useState } from 'react';
import { useGetTableQuery } from '../../hooks/useGetTableQuery';
import { useSearchParams } from 'react-router-dom';

interface TableBuilderProps {
  tableBuilder: TableBuilderInterface;
}

interface TableContextProps {
  children: React.ReactNode;
  value?: TableBuilderInterface['state'];
}

const TableContext = createContext<TableBuilderInterface['state']>({});

export const TableProvider = (props: TableContextProps) => {
  const state = useLocalObservable(() => props.value!);
  console.log('props.state', props.value);
  return (
    <TableContext.Provider value={state}>
      {props.children}
    </TableContext.Provider>
  );
};

export const useTableState = () => {
  return useContext(TableContext);
};

export const TableBuilder = observer(({ tableBuilder }: TableBuilderProps) => {
  const { data, isLoading, meta } = useGetTableQuery(tableBuilder);
  const urlSearchParams = new URLSearchParams(tableBuilder.query?.params);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams(urlSearchParams);

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
          {tableBuilder.buttons?.map(button => {
            return <ButtonBuilder key={v4()} buttonBuilder={button} />;
          })}
        </ButtonGroup>
      </HStack>
      <DataGrid data={toJS(data || [])} columns={toJS(columns) || []} />
      {tableBuilder.query?.params?.take && (
        <Pagination
          total={meta?.totalCount}
          page={currentPage}
          onChange={page => {
            searchParams.set('take', take.toString());
            searchParams.set('skip', ((page - 1) * take).toString());
            setSearchParams(searchParams);
          }}
        />
      )}
    </>
  );
});
