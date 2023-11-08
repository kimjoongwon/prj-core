import { useContext } from 'react';
import { CategoryEditPageContext } from '../provider';

export const useCategoryEditPage = () => {
  return useContext(CategoryEditPageContext);
};
