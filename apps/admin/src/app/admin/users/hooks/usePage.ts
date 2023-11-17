import { useContext } from 'react';
import { PageContext } from '../components/PageProvider/PageProvider';

export const usePage = () => {
  return useContext(PageContext);
};
