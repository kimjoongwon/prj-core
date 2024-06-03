import { useQueries } from './useQueries';
import { useState } from './useState';
import { useHandlers } from './useHandlers';
import { useContext } from './useContext';

export const usePage = () => {
  // 해당 페이지 상위의 정보(외부에서 받아온 정보, 절대로 의존성이 있어서는 안된다.)
  const context = useContext();

  const queries = useQueries({ context });

  const state = useState(queries);

  const handlers = useHandlers({ context, queries, state });

  // const props = useProps({ categoryId, parentCategoryId });

  return {
    state,
    handlers,
  };
};
