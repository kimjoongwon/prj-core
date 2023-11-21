import { useContext } from 'react';
import { SessionEditPageContext } from '../provider';

export const useSessionEditPage = () => {
  return useContext(SessionEditPageContext);
};


