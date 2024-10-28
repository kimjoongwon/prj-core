import { useLocalObservable } from 'mobx-react-lite';
import { CategoryDto, galaxy } from '@shared/frontend';
import { useQueries } from './useQueries';
import { useParams } from 'next/navigation';

export const useState = (props: ReturnType<typeof useQueries>) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const {
    getCategoryById: { data: res },
  } = props;

  const categoryForm = res.data || {
    name: '',
    ancestorIds: [],
    parentId: null,
    serviceId,
    tenantId: galaxy.auth.tenant?.id,
  };

  return useLocalObservable<{
    categoryForm: Partial<CategoryDto>;
  }>(() => ({
    categoryForm,
  }));
};
