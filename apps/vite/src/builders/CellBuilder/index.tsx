import { CellBuilderProps } from '@shared/types';
import { ButtonBuilder } from '../ButtonBuilder';
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
            <ButtonBuilder key={v4()} state={button} data={row.original} />
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
