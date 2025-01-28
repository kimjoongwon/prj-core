import { CellBuilderProps } from '@shared/types';
import { ButtonBuilder } from '../ButtonBuilder';
import { Tooltip } from '@heroui/react';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import { Delete, Edit, List, Plus } from 'lucide-react';

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
          if (button.icon === 'add') {
            return (
              <ButtonBuilder
                key={v4()}
                size="sm"
                variant="flat"
                icon={<Plus />}
                buttonBuilder={button}
                row={row.original}
              />
            );
          }
          if (button.icon === 'edit') {
            return (
              <ButtonBuilder
                key={v4()}
                size="sm"
                variant="flat"
                icon={<Edit />}
                buttonBuilder={button}
                row={row.original}
              />
            );
          }

          if (button.icon === 'delete') {
            return (
              <ButtonBuilder
                size="sm"
                key={v4()}
                icon={<Delete />}
                variant="flat"
                buttonBuilder={button}
                row={row.original}
              />
            );
          }
          if (button.icon === 'detail') {
            return (
              <ButtonBuilder
                size="sm"
                key={v4()}
                variant="flat"
                icon={<List />}
                buttonBuilder={button}
                row={row.original}
              />
            );
          }

          return null;
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
