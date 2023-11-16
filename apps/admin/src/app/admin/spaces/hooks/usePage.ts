import { useContext } from 'react';
import { SpacesPageContext } from '../provider';

export const useSpacesPage = () => {
  return useContext(SpacesPageContext);
};
