import {
  useCreateCategory,
  useFindCategoryById,
  useGetAllService,
  useUpdateCategory,
} from '@shared/frontend';
import { useContext } from './useContext';

interface Props {
  context: ReturnType<typeof useContext>;
}

export const useQueries = (props: Props) => {
  const {
    context: {
      categoryId,
      isEditMode,
      isExistParentCategory,
      parentCategoryId,
    },
  } = props;

  const { data: findCategoryByIdQueryData } = useFindCategoryById(categoryId, {
    query: { enabled: isEditMode },
  });

  const { data: findParentCategoryByIdQueryData } = useFindCategoryById(
    parentCategoryId || '',
    { query: { enabled: isExistParentCategory } },
  );

  const { mutateAsync: updateCategory } = useUpdateCategory();

  const { mutateAsync: createCategory } = useCreateCategory();

  const { data: services } = useGetAllService();

  return {
    userService: services?.find(service => service.name === 'USER'),
    createCategory,
    updateCategory,
    parentCategory: findParentCategoryByIdQueryData?.data,
    category: findCategoryByIdQueryData?.data,
  };
};
