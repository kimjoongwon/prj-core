import {
  CreateCategoryItemInput,
  UpdateCategoryInput,
} from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';

export const useStates = () => {
  const formState: CreateCategoryItemInput | UpdateCategoryInput =
    useLocalObservable(() => ({
      name: '',
      parentId: '',
    }));
};
