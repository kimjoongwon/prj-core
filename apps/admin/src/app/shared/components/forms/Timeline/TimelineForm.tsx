'use client';

import { observer } from 'mobx-react-lite';
import { Button, Calendar, Input } from '@coc/ui';
import { TimelineForm as TimelineFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';
import dayjs from 'dayjs';
import { useCoCRouter } from '@hooks';
import { TIMELINEITEMS_PAGE_PATH } from '../../../constants/timelineItems';
import { useParams } from 'next/navigation';

interface FormProps {
  state: TimelineFormType;
  schema: ZodSchema;
  selectedTimelineItemIds: string[];
}

export const TimelineForm = observer((props: FormProps) => {
  const { state, selectedTimelineItemIds } = props;
  const rotuer = useCoCRouter();
  const { sessionId, timelineId } = useParams<{
    sessionId: string;
    timelineId: string;
  }>();

  return (
    <div className="space-y-4">
      <Calendar
        readOnly
        state={state}
        path="session.dates"
        onClickDay={day => (state.date = dayjs().set('D', day).toDate())}
      />
      {state.date && (
        <>
          <div className="font-bold">
            {dayjs(state.date).format('YYYY년 MM월 DD일')}
          </div>
          <Input state={state} path="name" placeholder="타임라인명" />
          <Button
            onClick={() =>
              rotuer.push({
                url: TIMELINEITEMS_PAGE_PATH,
                params: {
                  sessionId,
                  timelineId,
                },
              })
            }
          />
          {state.timelineItems
            .filter(timelineItem =>
              selectedTimelineItemIds.includes(timelineItem.id),
            )
            .map((timelineItem, index) => {
              return <div>{timelineItem.title}</div>;
            })}
        </>
      )}
    </div>
  );
});
