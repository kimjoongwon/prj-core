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
            <ButtonBuilder
              key={v4()}
              buttonBuilder={button}
              row={row.original}
            />
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
      <div className="flex">
        {expandable && row.getCanExpand() ? (
          <div
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? '📂' : '📁'}
          </div>
        ) : null}
        {getValue<string>()}
      </div>
    </div>
  );
};
