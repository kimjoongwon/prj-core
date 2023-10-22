import { useContext } from 'react';
import { PageContext } from '../PageProvider';

export const usePage = () => {
  return useContext(PageContext);
};

