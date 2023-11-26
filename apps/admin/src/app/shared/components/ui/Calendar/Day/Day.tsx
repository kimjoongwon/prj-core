import { Button } from '@coc/ui';

export interface DayProps {
  state: {
    startDate: Date;
    endDate: Date;
  };
  day: number;
  active?: boolean;
}

export const Day = (props: DayProps) => {
  const { day, active } = props;

  return (
    <Button
      disabled={!active}
      onClick={() => {}}
      variant="bordered"
      className={`
      w-full 
      aspect-w-1
      aspect-h-1 
      border 
      border-gray-300 
      focus:outline-none 
      focus:ring-2 
      focus:ring-blue-500 
      hover:bg-blue-100`}
    >
      <div>
        <div
          className="
          absolute 
          top-1 
          right-1 
          text-3xl
          font-bold
          text-gray-500"
        >
          {day}
        </div>
      </div>
    </Button>
  );
};
