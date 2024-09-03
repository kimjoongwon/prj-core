import { useMeta } from './useMeta';

export const useProps = () => {
  const { repeatCycleTypeOptions, sessionTypeOptions } = useMeta();

  return {
    sessionTypeOptions,
    repeatCycleTypeOptions,
  };
};
