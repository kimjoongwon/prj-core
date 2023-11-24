import { range } from 'lodash-es';
import dayjs from 'dayjs';

export const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

export const Calendar = () => {
  const startOfMonthDay = dayjs().startOf('M').day();
  const endOfMonthDay = 7 - dayjs().endOf('M').day();

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {DAYS.map(day => (
          <div>{day}</div>
        ))}
        {range(0, 35).map(value => {
          return (
            <div className="">
              <div>{value >= startOfMonthDay && value <= 35 - endOfMonthDay ? value - startOfMonthDay + 1 : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
