import { useContext } from 'react';
import { TimelinesPageContext } from '../provider';

export const useTimelinesPage = () => {
  return useContext(TimelinesPageContext);
};
