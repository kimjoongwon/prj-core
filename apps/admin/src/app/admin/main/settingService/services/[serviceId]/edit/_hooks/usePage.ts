import { useParams } from 'next/navigation';
import { useMeta } from './useMeta';
import { useHandlers } from './useHandlers';
import { useQueries } from './useQueries';
import { useState } from './useState';

export const usePage = () => {
  const params = useParams<{ serviceId: string }>();
  const queries = useQueries();
  const state = useState({
    queries,
  });
  const handlers = useHandlers({
    queries,
    state,
  });
  const meta = useMeta({ handlers });
  return {
    state,
    queries,
    meta,
    params,
    handlers,
  };
};
