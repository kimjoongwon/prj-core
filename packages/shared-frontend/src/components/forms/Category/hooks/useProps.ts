import { CategoryFormProps } from '..';
import { useQueries } from './useQueries';

export const useProps = (props: CategoryFormProps) => {
  const { state } = props;
  const { childCategoryOptions } = useQueries({
    state,
  });

  return {
    state,
    childCategoryOptions,
    ancestorIds: [],
  };
};
