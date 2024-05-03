import { mean } from 'lodash-es';
import { useMeta } from './useMeta';

export const useServiceEditPage = () => {
  const meta = useMeta();
  return {
    meta,
  };
};
