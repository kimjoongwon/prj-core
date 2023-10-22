import { useContext } from 'react';
import { PageContext } from '../_components/PageProvider/PageProvider';

export const usePage = () => {
  return useContext(PageContext);
};

