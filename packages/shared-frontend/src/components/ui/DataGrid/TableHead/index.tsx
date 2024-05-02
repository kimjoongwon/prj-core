import { HeaderGroup, RowData, Table, flexRender } from '@tanstack/react-table';
import { ColumnResizer } from './ColumnResizer';
import { ColumnSorting } from './ColumnSorting';
import { TableRow } from '../TableRow';
import { TableHeaderCell } from '../TableHeaderCell';

interface TableHeaderProps<T> {
  table: Table<T>;
}

export const TableHead = <T extends any>(props: TableHeaderProps<T>) => {
  const { table } = props;

  const [headerGroups] = getTableHeaderGroups(table, 'center');

  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <TableRow>
          {headerGroup.headers.map(header => (
            <TableHeaderCell
              className="relative"
              key={header.id}
              style={{
                width: header.getSize(),
              }}
              colSpan={header.colSpan}
            >
              {header.isPlaceholder ? null : (
                <ColumnSorting header={header}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </ColumnSorting>
              )}
              <ColumnResizer header={header} />
            </TableHeaderCell>
          ))}
        </TableRow>
      ))}
    </thead>
  );
};

type TableGroup = 'center' | 'left' | 'right';

export function getTableHeaderGroups<T extends RowData>(
  table: Table<T>,
  tg?: TableGroup,
): [HeaderGroup<T>[], HeaderGroup<T>[]] {
  if (tg === 'left') {
    return [table.getLeftHeaderGroups(), table.getLeftFooterGroups()];
  }

  if (tg === 'right') {
    return [table.getRightHeaderGroups(), table.getRightFooterGroups()];
  }

  if (tg === 'center') {
    return [table.getCenterHeaderGroups(), table.getCenterFooterGroups()];
  }

  return [table.getHeaderGroups(), table.getFooterGroups()];
}
