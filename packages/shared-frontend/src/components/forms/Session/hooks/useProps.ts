import { useLocalObservable } from 'mobx-react-lite';
import { CreateSessionDto, UpdateSessionDto } from '../../../../model';
import { useMeta } from './useMeta';
import { useReactions } from './useReactions';

export const useProps = (props: {
  state: CreateSessionDto | UpdateSessionDto;
}) => {
  const { state } = props;
  const { repeatCycleTypeOptions, sessionTypeOptions } = useMeta();
  const inputState = useLocalObservable(() => ({
    ...state,
    rangeMode: false,
    oneTimeStartDate: new Date().toISOString(),
    oneTimeEndDate: new Date().toISOString(),
  }));

  return {
    state: inputState,
    sessionTypeOptions,
    repeatCycleTypeOptions,
  };
};
