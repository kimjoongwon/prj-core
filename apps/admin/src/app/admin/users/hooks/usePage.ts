import { useContext } from 'react';
import { PageContext } from '../provider';

export const usePage = () => {
  return useContext(PageContext);
};
