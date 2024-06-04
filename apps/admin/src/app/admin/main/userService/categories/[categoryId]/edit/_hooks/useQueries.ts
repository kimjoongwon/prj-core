import {
  myUniv,
  useCreateCategory,
  useFindCategoryByIdSuspense,
  useGetAllServiceSuspense,
  useUpdateCategory,
} from '@shared/frontend';

import { useContext } from './useContext';

interface Props {
  context: ReturnType<typeof useContext>;
}

export const useQueries = (props: Props) => {
  const {
    context: { categoryId, parentCategoryId },
  } = props;

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

  const userService = services?.find(service => service.name === 'USER');

  const category = findCategoryByIdQueryData?.data || {
    name: '',
    ancestorIds,
    parentId: parentCategory?.id,
    serviceId: userService?.id,
    spaceId: myUniv.auth.currentSpaceId,
  };

  return {
    createCategory,
    updateCategory,
    category,
    parentCategory: findParentCategoryByIdQueryData?.data,
  };
};
