import { useInputState } from '../../../hooks/useInputState';
import { CalendarState } from '@shared/types';
import { useContext } from './useContext';
import dayjs from 'dayjs';

export const useState = <T extends object>(props: {
  context: ReturnType<typeof useContext<T>>;
}) => {
  const {
    context: { state, path },
  } = props;

  const inputState = useInputState<CalendarState, Date[]>({
    extendState: {
      calendarInput: {
        header: {
          date: dayjs().startOf('d').toDate(),
          decreaseMonth() {
            // @ts-ignore
            inputState.calendarInput.header.date = dayjs(
              // @ts-ignore
              inputState.calendarInput.header.date,
            )
              .subtract(1, 'M')
              .toDate();
          },
          increaseMonth() {
            // @ts-ignore
            inputState.calendarInput.header.date = dayjs(
              // @ts-ignore
              inputState.calendarInput.header.date,
            )
              .add(1, 'M')
              .toDate();
          },
        },
        dates: [],
      },
    },
    defaultValue: [],
    // @ts-ignore
    state,
    path,
  });

  return inputState;
};
