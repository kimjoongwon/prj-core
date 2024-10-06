import { CategoryFormProps } from '..';
import { useGetCategoriesByQuerySuspense } from '../../../../apis';

export const useQueries = ({
  state,
}: {
  state: CategoryFormProps['state'];
}) => {
  const { data: res } = useGetCategoriesByQuerySuspense({});

  return {
    childCategoryOptions:
      res?.data.map(category => ({
        text: category.name,
        value: category.id,
      })) || [],
  };
};
