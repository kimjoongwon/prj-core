import { useTimelineItemFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { timelineItemId = 'new' } = useParams();
  const timelineItemFormQuery = useTimelineItemFormQuery({
    id: timelineItemId as string,
  });

  return {
    timelineItemFormQuery,
  };
};
