import { CreateServiceInput, UpdateServiceInput } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useParams, useSearchParams } from 'next/navigation';
import { useQueries } from './useQueries';

export const useState = (context: ReturnType<typeof useQueries>) => {
  const { id = 'new' } = useParams();
  const searchParams = useSearchParams();

  const {
    serviceQuery: { data },
    serviceFormQuery: {
      data: { serviceForm },
    },
  } = context;

  const createServiceInput = useLocalObservable<CreateServiceInput>(() => ({
    categoryId: '',
    name: '',
  }));

  const updateServiceInput = useLocalObservable<UpdateServiceInput>(() => ({
    id: id as string,
    name: data?.service.name,
  }));

  return {
    createServiceInput,
    updateServiceInput,
  };
};
