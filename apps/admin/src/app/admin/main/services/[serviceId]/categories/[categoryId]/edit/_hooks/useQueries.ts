import {
  galaxy,
  useCreateCategory,
  useFindCategoryByIdSuspense,
  useGetAllServiceSuspense,
  useUpdateCategory,
} from '@shared/frontend';

import { useContext } from './useContext';
import { useParams } from 'next/navigation';

interface Props {
  context: ReturnType<typeof useContext>;
}

export const useQueries = (props: Props) => {
  const {
    context: { categoryId, parentCategoryId },
  } = props;
  const { serviceId } = useParams();
  const { data: findCategoryByIdQueryData } =
    useFindCategoryByIdSuspense(categoryId);

  const { data: findParentCategoryByIdQueryData } = useFindCategoryByIdSuspense(
    parentCategoryId || '',
  );

  const { data: services } = useGetAllServiceSuspense();

  const { mutateAsync: updateCategory } = useUpdateCategory();

  const { mutateAsync: createCategory } = useCreateCategory();

  const parentCategory = findParentCategoryByIdQueryData?.data;

  const parentCategoryAncestorIds = parentCategory?.ancestorIds || [];

  const ancestorIds = parentCategory?.id
    ? parentCategoryAncestorIds.concat([parentCategory.id])
    : [];

  const category = findCategoryByIdQueryData?.data || {
    name: '',
    ancestorIds,
    parentId: parentCategory?.id,
    serviceId,
    spaceId: galaxy.auth.user?.tenants?.find(tenant => tenant.active)?.tenancy
      ?.spaceId,
  };

  return {
    createCategory,
    updateCategory,
    category,
    parentCategory: findParentCategoryByIdQueryData?.data,
  };
};
