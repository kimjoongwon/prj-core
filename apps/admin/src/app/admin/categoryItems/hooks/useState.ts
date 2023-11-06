import { CategoryItem } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';

export interface CategoryItemState extends CategoryItem {
  isSelected: boolean;
}

type State = {
  categoryItems: CategoryItem[];
  selectedCategoryItems: CategoryItem[];
  form: {
    name: string;
    parentId: string | null;
  };
};

export const useState = () => {
  const state = useLocalObservable<State>(() => ({
    categoryItems: [],
    selectedCategoryItems: [],
    form: {
      name: '',
      parentId: null,
    },
  }));

  return state;
};
