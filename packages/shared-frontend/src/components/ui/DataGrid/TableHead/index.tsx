import { Header, Table, flexRender } from '@tanstack/react-table';

interface TableHeaderProps<T> {
  table: Table<T>;
}

export const TableHead = <T extends any>(props: TableHeaderProps<T>) => {
  const { table } = props;

  return (
    <thead>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
