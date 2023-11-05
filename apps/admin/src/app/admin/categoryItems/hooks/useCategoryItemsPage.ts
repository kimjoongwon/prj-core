import { useContext } from 'react';
import { PageContext } from '../provider';

export const useCategoryItemsPage = () => {
  return useContext(PageContext);
};
