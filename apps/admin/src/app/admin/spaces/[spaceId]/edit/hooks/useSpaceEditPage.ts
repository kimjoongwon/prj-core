import { useContext } from 'react';
import { SpaceEditPageContext } from '../provider';

export const useSpaceEditPage = () => {
  return useContext(SpaceEditPageContext);
};


