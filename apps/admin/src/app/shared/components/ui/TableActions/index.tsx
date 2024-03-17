import { Button } from '@coc/web';
import type { ColumnMeta } from '@columns';
import { CellContext } from '@tanstack/react-table';

export const TableActions = <T extends object>(
  context: CellContext<T, any>,
) => {
  const meta = context.column.columnDef.meta as ColumnMeta<T>;

  return (
    <div className="space-x-2 flex flex-1 xs:flex-col">
      {meta.buttons.map((button, index) => {
        const { onClick, ...rest } = button;
        return (
          <Button
            {...rest}
            key={index}
            size="sm"
            variant="ghost"
            onClick={() => button.onClick(context)}
          >
            {button.children}
          </Button>
        );
      })}
    </div>
  );
};
