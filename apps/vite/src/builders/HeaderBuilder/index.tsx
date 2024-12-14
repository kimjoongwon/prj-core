import { HeaderContext } from '@tanstack/react-table';

export const HeaderBuilder = (props: HeaderContext<unknown, unknown>) => {
  const { column, table } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (column.columnDef.meta?.expandable) {
    return (
      <div>
        <button
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
        >
          {table.getIsAllRowsExpanded() ? '📂' : '📁'}
        </button>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error */}
        {column.columnDef.meta?.headerName ?? column.id}
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <>{column.columnDef.meta?.headerName ?? column.id}</>;
};
