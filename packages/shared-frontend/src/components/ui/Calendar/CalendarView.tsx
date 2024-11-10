import Calendar, { CalendarProps } from 'react-calendar';

export interface CalendarViewProps extends CalendarProps {}

export const CalendarView = (props: CalendarViewProps) => {
  return <Calendar {...props} />;
};
