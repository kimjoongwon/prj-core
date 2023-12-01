import { useContext } from 'react';
import { TimelineItemEditPageContext } from '../provider';

export const useTimelineItemEditPage = () => {
  return useContext(TimelineItemEditPageContext);
};


