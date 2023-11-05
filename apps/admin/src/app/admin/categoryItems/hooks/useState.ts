import { CategoryItem } from '@__generated__/graphql';
import { difference, differenceWith } from 'lodash-es';
import { observable, reaction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useQueries } from './useQueries';

export interface CategoryItemState extends CategoryItem {
  isSelected: boolean;
}

type State = {
  categoryItems: CategoryItemState[];
  selectedCategoryItem: CategoryItemState | null;
  form: {
    name: string;
    parentId: string | null;
  };
};

export const useState = (context: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { queries } = context;
  const categoryItems =
    queries.categoryItemTreesQuery.data?.categoryItemTrees.map(categoryItem => {
      return {
        ...categoryItem,
        isSelected: false,
      };
    });

  const state = observable<State>({
    categoryItems: categoryItems,
    selectedCategoryItem: null,
    form: {
      name: '',
      parentId: null,
    },
  });

  return state;
};
