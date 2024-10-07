import { CategoryFormProps } from '..';
import { useQueries } from './useQueries';
import { useReactions } from './useReactions';

export const useProps = (props: CategoryFormProps) => {
  const { state } = props;
  const { childCategoryOptions } = useQueries({
    state,
  });

  useReactions(props);

  return {
    state,
    childCategoryOptions,
    ancestorIds: [],
  };
};
