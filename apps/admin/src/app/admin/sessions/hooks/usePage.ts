import { useContext } from 'react';
import { SessionsPageContext } from '../provider';

export const useSessionsPage = () => {
  return useContext(SessionsPageContext);
};
