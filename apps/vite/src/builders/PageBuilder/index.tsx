import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Container, Grid2 as Grid } from '@mui/material';
import { APIManager, DataGrid, Text } from '@shared/frontend';
import { PageBuilder as PageBuilderState } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { FormBuilder } from '../FormBuilder';
import { Outlet } from 'react-router-dom';
import { HTMLProps } from 'react';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

interface PageBuilderProps {
  state: PageBuilderState | undefined;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { state } = props;
  let items = [];
  if (state?.type === 'Table') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { data: response } = APIManager[state?.table?.queryKey](
      state?.table?.query || {},
      {
        query: {
          enabled: !!state?.table?.queryKey,
        },
      },
    );

    items = response?.data || [];
  }

  const getExpandColumn = (column: ColumnDef<unknown>): ColumnDef<unknown> => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    accessorKey: column?.accessorKey,
    header: ({ table, column }) => (
      <>
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />{' '}
        <button
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
        >
          {table.getIsAllRowsExpanded() ? '👇' : '👉'}
        </button>{' '}
        {column.id}
      </>
    ),
    cell: ({ row, getValue }) => (
      <div
        style={{
          // Since rows are flattened by default,
          // we can use the row.depth property
          // and paddingLeft to visually indicate the depth
          // of the row
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        <div>
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />{' '}
          {row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
              {row.getIsExpanded() ? '👇' : '👉'}
            </button>
          ) : (
            '🔵'
          )}{' '}
          {getValue<string>()}
        </div>
      </div>
    ),
  });

  const columns = state?.table?.columns.map(column => {
    if (column?.type === 'expand') {
      return getExpandColumn(column);
    }
    return column;
  });

  if (state?.type === 'Outlet') {
    return <Outlet />;
  }

  return (
    <Container maxWidth="sm">
      {state?.form && (
        <FormBuilder state={state.form!}>
          {state?.form?.sections?.map(section => {
            return (
              <>
                <Text variant="h5">{section.name}</Text>
                <Grid container spacing={1}>
                  {section.components?.map(component => (
                    <Grid key={v4()} {...component.gridProps}>
                      <ComponentBuilder state={component} />
                    </Grid>
                  ))}
                </Grid>
              </>
            );
          })}
        </FormBuilder>
      )}
      {state?.type === 'Table' && (
        <DataGrid data={items} columns={columns || []} />
      )}
    </Container>
  );
});

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}
