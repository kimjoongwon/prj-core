import { useTimelineFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { timelineId = 'new', sessionId } = useParams();
  const timelineFormQuery = useTimelineFormQuery({
    timelineId: timelineId as string,
    sessionId: sessionId as string,
  });

  return {
    timelineFormQuery,
  };
};
