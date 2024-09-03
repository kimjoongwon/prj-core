import dayjs from 'dayjs';
import { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';

export interface CalendarViewProps extends CalendarProps {}
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const CalendarView = (props: CalendarViewProps) => {
  const [value, onChange] = useState<Value>(dayjs().add(5, 'D').toDate());

  return <Calendar {...props} />;
};
