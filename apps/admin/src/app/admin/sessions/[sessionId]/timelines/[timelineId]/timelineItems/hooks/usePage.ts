import { useContext } from 'react';
import { TimelineItemsPageContext } from '../provider';

export const useTimelineItemsPage = () => {
  return useContext(TimelineItemsPageContext);
};
