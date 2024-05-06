import { CreateServiceDto, UpdateServiceDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { service } = queries;
  return useLocalObservable<{
    form: CreateServiceDto | UpdateServiceDto;
  }>(() => ({
    form: { ...service },
  }));
};
