import { useParams, useSearchParams } from 'next/navigation';

export const useContext = () => {
  const { categoryId = 'new' } = useParams<{ categoryId: string }>();
  const searchParams = useSearchParams();
  const parentCategoryId = searchParams.get('parentCategoryId');

  const isEditMode = categoryId !== 'new';
  const isExistParentCategory = !!parentCategoryId;

  return {
    categoryId,
    isEditMode,
    isExistParentCategory,
    parentCategoryId,
  };
};
