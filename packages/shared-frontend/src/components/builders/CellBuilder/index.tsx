import { v4 } from 'uuid';
import { CellBuilderProps } from '@shared/types';
import { ButtonBuilder } from '../ButtonBuilder';
import dayjs from 'dayjs';
import { Button } from '@heroui/react';
import { Plate } from '../../../providers';

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
          return (
            <Button
              key={v4()}
              {...button}
              buttonType="cell"
              onPress={() => {
                Plate.navigation.getNavigator().pushByName('그라운드 편집', {
                  id: row.original.id,
                  type: 'create',
                });
              }}
            >
              생성
            </Button>
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
