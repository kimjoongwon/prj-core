import { DatePicker, DatePickerProps } from '@nextui-org/react';

export interface DatePickerViewProps extends DatePickerProps {}

export const DatePickerView = (props: DatePickerProps) => {
  return <DatePicker {...props} />;
};
