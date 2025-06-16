import { CalendarInputProps } from '@shared/types';

export const useContext = <T extends object>(props: CalendarInputProps<T>) => {
  return props;
};
