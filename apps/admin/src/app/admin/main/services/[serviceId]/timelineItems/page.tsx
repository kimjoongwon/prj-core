import { getTimelineItemsByQuery, TimelineItemsTable } from '@shared/frontend';
import { cookies } from 'next/headers';

const TimelineItemsPage = async () => {
  const accessToken = cookies().get('accessToken');
  const timelineItemsQuery = await getTimelineItemsByQuery(
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
      },
    },
  );

  console.log('timelineItemsQuery', timelineItemsQuery);

  return <TimelineItemsTable timelineItems={timelineItemsQuery.data || []} />;
};

export default TimelineItemsPage;
