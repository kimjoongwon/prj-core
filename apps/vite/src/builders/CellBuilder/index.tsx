import { CellBuilderProps } from '@shared/types';
import { Button } from '../ButtonBuilder';
import { v4 } from 'uuid';

export const CellBuilder = ({
  row,
  getValue,
  buttons,
  expandable = false,
}: CellBuilderProps) => {
  if (buttons) {
    return (
      <div className="flex space-x-1">
        {buttons.map(button => {
          return (
            <Button key={v4()} buttonBuilder={button} data={row.original} />
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        paddingLeft: expandable ? `${row.depth * 2}rem` : undefined,
      }}
    >
      <div>
        {expandable && row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? '📂' : '📁'}
          </button>
        ) : null}
        {getValue<string>()}
      </div>
    </div>
  );
};
