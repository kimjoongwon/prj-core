import { useInputState } from '../../../../hooks/useInputState';
import { useContext } from './useContext';

export const useState = <T extends object>(props: {
  context: ReturnType<typeof useContext<T>>;
}) => {
  const {
    context: { state, path },
  } = props;

  const inputState = useInputState<{ calendarDate: Date }, Date[]>({
    extendState: { calendarDate: new Date() },
    state,
    path,
  });

  return inputState;
};
