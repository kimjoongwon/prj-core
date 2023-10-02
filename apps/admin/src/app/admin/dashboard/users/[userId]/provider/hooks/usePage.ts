import { useContext } from 'react';
import { PageContext } from '..';

export const usePage = () => {
  return useContext(PageContext);
};
