import { Spacer } from '@nextui-org/react';
import Button from '../../Button';

export interface DayProps {
  day: number;
  active?: boolean;
  selected?: boolean;
  onClickDay?: (day: number) => void;
  readOnly?: boolean;
}

export const Day = (props: DayProps) => {
  const { day, active, onClickDay, selected, readOnly = false } = props;

  if (readOnly) {
    return (
      <Button
        variant="light"
        disabled={!selected}
        onClick={e => {
          e.preventDefault();
          onClickDay && onClickDay(day);
        }}
        className="min-w-0 w-full aspect-w-1 aspect-h-1 border-1 rounded-md"
      >
        <div className="space-y-0.5 flex flex-col justify-between">
          <div
            className={`text-right ${
              selected ? 'text-blue-500' : 'text-gray-500'
            } font-bold p-1`}
          >
            {day}
          </div>
          {selected && <div className="pb-2 bg-blue-500 h-2 rounded-xl" />}
          <Spacer y={0.5} />
        </div>
      </Button>
    );
  }

  return (
    <Button
      disabled={!active || readOnly}
      onClick={() => onClickDay && onClickDay(day)}
      color={selected ? 'primary' : 'default'}
      variant={selected ? 'solid' : 'bordered'}
      className={`
      min-w-0
      w-full
      aspect-w-1
      aspect-h-1`}
    >
      <div>
        <div
          className={`
          absolute 
          top-1 
          right-1
          text-medium
          ${active ? undefined : 'text-gray-500'}
          font-bold`}
        >
          {day}
        </div>
      </div>
    </Button>
  );
};
