import { TableRow } from '@nextui-org/react';

export const DaysOfWeek = () => {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

  return (
    <TableRow>
      {daysOfWeek.map(dayOfWeek => {
        return (
          <div
            key={dayOfWeek}
            className={`${
              ['SAT', 'SUN'].includes(dayOfWeek) ? 'text-danger-400' : undefined
            } text-large font-bold text-right`}
          >
            {dayOfWeek}
          </div>
        );
      })}
    </TableRow>
  );
};
