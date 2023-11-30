import { useContext } from 'react';
import { TimelineEditPageContext } from '../provider';

export const useTimelineEditPage = () => {
  return useContext(TimelineEditPageContext);
};


