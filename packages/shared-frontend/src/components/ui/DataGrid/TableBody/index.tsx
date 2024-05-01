import { Table, flexRender } from '@tanstack/react-table';

interface TableBodyProps<T> {
  table: Table<T>;
}

export const TableBody = <T extends any>(props: TableBodyProps<T>) => {
  const { table } = props;
  return (
    <tbody>
      {table.getRowModel().rows.map(row => (
        <tr key={row.id}>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
