import { CreateServiceInput, UpdateServiceInput } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { useQueries } from './useQueries';

export const useState = (context: ReturnType<typeof useQueries>) => {
  const { serviceId = 'new' } = useParams();

  const {
    serviceQuery: { data },
    serviceFormQuery: {
      data: { serviceForm },
    },
  } = context;

  const createServiceInput = useLocalObservable<CreateServiceInput>(() => ({
    name: serviceForm.name || '',
  }));

  const updateServiceInput = useLocalObservable<UpdateServiceInput>(() => ({
    id: serviceId as string,
    name: data?.service.name,
  }));

  return {
    createServiceInput,
    updateServiceInput,
  };
};
