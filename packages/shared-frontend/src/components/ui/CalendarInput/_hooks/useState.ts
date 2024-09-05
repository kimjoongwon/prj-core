import { useInputState } from '../../../../hooks/useInputState';
import { State } from '../_types';
import { useContext } from './useContext';
import dayjs from 'dayjs';

export const useState = <T extends object>(props: {
  context: ReturnType<typeof useContext<T>>;
}) => {
  const {
    context: { state, path },
  } = props;

  const inputState = useInputState<State, Date[]>({
    extendState: {
      calendarInput: {
        header: {
          date: dayjs().startOf('d').toDate(),
          decreaseMonth() {
            inputState.calendarInput.header.date = dayjs(
              inputState.calendarInput.header.date,
            )
              .subtract(1, 'M')
              .toDate();
          },
          increaseMonth() {
            inputState.calendarInput.header.date = dayjs(
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
    state,
    path,
  });

  return inputState;
};
