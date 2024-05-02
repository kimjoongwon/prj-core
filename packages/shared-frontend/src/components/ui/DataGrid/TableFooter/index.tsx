import { Table, flexRender } from '@tanstack/react-table';
import { getTableHeaderGroups } from '../TableHead';

interface TableFooterProps<T> {
  table: Table<T>;
}

export const TableFooter = <T extends any>(props: TableFooterProps<T>) => {
  const { table } = props;

  const [, footerGroup] = getTableHeaderGroups(table, 'center');

  return (
    <tfoot>
      {footerGroup.map(footerGroup => (
        <tr key={footerGroup.id}>
          {footerGroup.headers.map(header => (
            <th key={header.id} colSpan={header.colSpan}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
            </th>
          ))}
        </tr>
      ))}
    </tfoot>
  );
};
