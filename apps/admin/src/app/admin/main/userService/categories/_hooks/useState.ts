import { CategoryDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  return useLocalObservable(() => ({
    selectedCategory: {} as CategoryDto,
  }));
};
