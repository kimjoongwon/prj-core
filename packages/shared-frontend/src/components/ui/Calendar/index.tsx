'use client';
import 'react-calendar/dist/Calendar.css';

import { CalendarView, CalendarViewProps } from './CalendarView';

interface CalendarProps extends CalendarViewProps {}

export const Calendar = (props: CalendarProps) => {
  return <CalendarView {...props} />;
};
