import { useMeta } from './useMeta';
import { useState } from './useState';
import { SessionFormProps } from '../types';
import { useReactions } from './useReactions';

export const useProps = (props: SessionFormProps) => {
  const state = useState({
    state: props.state,
  });

  useReactions({
    state,
  });

  const { repeatCycleTypeOptions, sessionTypeOptions } = useMeta();

  return {
    state,
    sessionTypeOptions,
    repeatCycleTypeOptions,
  };
};
