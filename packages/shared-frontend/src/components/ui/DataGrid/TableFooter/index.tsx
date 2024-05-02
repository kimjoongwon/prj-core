import { Table, flexRender } from '@tanstack/react-table';
import { getTableHeaderGroups } from '../TableHead';
import { TableRow } from '../TableRow';
import { TableHeaderCell } from '../TableHeaderCell';

interface TableFooterProps<T> {
  table: Table<T>;
}

export const TableFooter = <T extends any>(props: TableFooterProps<T>) => {
  const { table } = props;

  const [, footerGroup] = getTableHeaderGroups(table, 'center');

  return (
    <tfoot>
      {footerGroup.map(footerGroup => (
        <TableRow>
          {footerGroup.headers.map(header => (
            <TableHeaderCell>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
            </TableHeaderCell>
          ))}
        </TableRow>
      ))}
    </tfoot>
  );
};
