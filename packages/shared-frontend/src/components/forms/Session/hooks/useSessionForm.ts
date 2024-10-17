import { useMeta } from './useMeta';

export const useSessionForm = () => {
  const { repeatCycleTypeOptions, sessionTypeOptions } = useMeta();

  return {
    sessionTypeOptions,
    repeatCycleTypeOptions,
  };
};
