import { HeaderGroup, RowData, Table, flexRender } from '@tanstack/react-table';
import { ColumnResizer } from './ColumnResizer';

interface TableHeaderProps<T> {
  table: Table<T>;
}

export const TableHead = <T extends any>(props: TableHeaderProps<T>) => {
  const { table } = props;

  const [headerGroups] = getTableHeaderGroups(table, 'center');

  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              className="relative"
              key={header.id}
              style={{
                width: header.getSize(),
              }}
              colSpan={header.colSpan}
            >
              {header.isPlaceholder ? null : (
                <>
                  <div>
                    {header.column.getCanGroup() ? (
                      // If the header can be grouped, let's add a toggle
                      <button
                        onClick={header.column.getToggleGroupingHandler()}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        {header.column.getIsGrouped()
                          ? `🛑(${header.column.getGroupedIndex()})`
                          : `👊`}
                      </button>
                    ) : null}{' '}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}{' '}
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                    >
                      {{
                        asc: '🔼',
                        desc: '🔽',
                      }[header.column.getIsSorted() as string] ?? '📶'}
                    </button>
                  </div>
                  {/* {header.column.getCanFilter() ? (
                    <div>
                      <Filter column={header.column} table={table} />
                      filter영역
                    </div>
                  ) : null} */}
                </>
              )}
              <ColumnResizer header={header} />
              {/* {!header.isPlaceholder && header.column.getCanPin() && (
                <div>tablePin 영역</div>
                <TablePins
                  isPinned={header.column.getIsPinned()}
                  pin={header.column.pin}
                />
              )} */}
            </th>
          ))}
        </tr>
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
