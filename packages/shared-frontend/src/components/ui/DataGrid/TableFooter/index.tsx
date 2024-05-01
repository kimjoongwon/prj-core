import { Table, flexRender } from '@tanstack/react-table';

interface TableFooterProps<T> {
  table: Table<T>;
}

export const TableFooter = <T extends any>(props: TableFooterProps<T>) => {
  const { table } = props;

  return (
    <tfoot>
      {table.getFooterGroups().map(footerGroup => (
        <tr key={footerGroup.id}>
          {footerGroup.headers.map(header => (
            <th key={header.id}>
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
