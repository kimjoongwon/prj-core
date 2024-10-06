import { useContext } from './useContext';
import { useHandlers } from './useHandlers';
import { useProps } from './useProps';
import { useQueries } from './useQueries';
import { useState } from './useState';

export const usePage = () => {
  const context = useContext();
  const state = useState();
  const queries = useQueries();
  const props = useProps({ queries, state });
  const { onClickCard, onClickCreate, onClickDelete, onClickDetail } =
    useHandlers({ queries, context, props, state });

  return {
    ...props,
    categories: queries.categories || [],
    meta: {
      onClickCard,
      onClickCreate,
      onClickDelete,
      onClickDetail,
    },
  };
};
