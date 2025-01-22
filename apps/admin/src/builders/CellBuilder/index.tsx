import { CellBuilderProps } from '@shared/types';
import { ButtonBuilder } from '../ButtonBuilder';
import { v4 } from 'uuid';
import { ButtonGroup } from '@heroui/react';
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
        <ButtonGroup size="sm">
          {buttons.map(button => {
            return (
              <ButtonBuilder
                key={v4()}
                buttonBuilder={button}
                row={row.original}
              />
            );
          })}
        </ButtonGroup>
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
