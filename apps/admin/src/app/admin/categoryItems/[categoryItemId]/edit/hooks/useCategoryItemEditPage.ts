import { useContext } from 'react';
import { PageContext } from '../provider';

export const useCategoryItemEditPage = () => {
  return useContext(PageContext);
};
