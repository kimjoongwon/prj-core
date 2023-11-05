'use client';

import { ContainerProps } from '@coc/ui';
import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { CategoryItemState, useHandlers, useQueries, useState } from './hooks';
import { useMutations } from './hooks/useMutations';
import { toJS } from 'mobx';
import { CategoryItem } from '@__generated__/graphql';

interface PageContext {
  state: ReturnType<typeof useState>;
  categoryItemGroupSection: {
    state: {
      categoryItems: ReturnType<typeof useState>['categoryItems'];
    };
    onClickDeleteIcon: ReturnType<typeof useHandlers>['onClickDeleteIcon'];
    onClickCategoryItem: ReturnType<typeof useHandlers>['onClickCategoryItem'];
    onClickNewCategory: () => void;
    categoryItems: CategoryItem[];
  };
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const PageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const queries = useQueries();
  const state = useState({
    queries,
  });
  const mutations = useMutations();
  const categoryItems = queries.categoryItemTreesQuery.data.categoryItemTrees;

  const { onClickCategoryItem, onClickNewCategory, onClickDeleteIcon } =
    useHandlers({
      state,
      mutations,
    });

  return (
    <PageContext.Provider
      value={{
        state,
        categoryItemGroupSection: {
          state: { categoryItems: state.categoryItems },
          onClickNewCategory,
          onClickCategoryItem,
          onClickDeleteIcon,
          categoryItems,
        },
      }}
    >
      {children}
    </PageContext.Provider>
  );
});
