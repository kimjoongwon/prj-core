import { v4 } from 'uuid';
import { CellBuilderProps } from '@shared/types';
import { CellButtonBuilder } from '../CellButtonBuilder';
import dayjs from 'dayjs';

export const CellBuilder = ({
  row,
  getValue,
  buttons,
  type,
  expandable = false,
}: CellBuilderProps) => {
  if (type === 'date') {
    return <div>{dayjs(getValue() as string).format('YYYY.MM.DD')}</div>;
  }

  if (type === 'dateTime') {
    return <div>{dayjs(getValue() as string).format('YYYY.MM.DD HH:mm')}</div>;
  }

  if (type === 'time') {
    return <div>{dayjs(getValue() as string).format('HH:mm')}</div>;
  }

  if (buttons) {
    return (
      <div className="flex space-x-1">
        {buttons.map(button => {
          return <CellButtonBuilder key={v4()} {...button} />;
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
