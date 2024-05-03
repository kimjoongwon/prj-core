import { useMeta } from './useMeta';

export const usePage = () => {
  const meta = useMeta();

  return {
    meta,
  };
};
