import { Button } from '@coc/shared';
import { CalendarLocalState } from '../Calendar';

export interface DayProps {
  day: number;
  active?: boolean;
  selected?: boolean;
  onClickDay?: (day: number) => void;
}

export const Day = (props: DayProps) => {
  const { day, active, onClickDay, selected } = props;

  return (
    <Button
      disabled={!active}
      onClick={() => onClickDay && onClickDay(day)}
      color={selected ? 'primary' : 'default'}
      variant={selected ? 'solid' : 'bordered'}
      className={`
      min-w-0
      w-full
      aspect-w-1
      aspect-h-1
      border
      border-gray-300 
      focus:outline-none 
      focus:ring-2 
      focus:ring-blue-500`}
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
