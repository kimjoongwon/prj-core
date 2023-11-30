'use client';

import { observer } from 'mobx-react-lite';
import { Calendar } from '@coc/ui';
import { TimelineForm as TimelineFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';
import dayjs from 'dayjs';

interface FormProps {
  state: TimelineFormType;
  schema: ZodSchema;
}

export const TimelineForm = observer((props: FormProps) => {
  const { state } = props;

  return (
    <div className="space-y-4">
      <Calendar
        readOnly
        state={state}
        path="session.dates"
        onClickDay={day => (state.date = dayjs().set('D', day).toDate())}
      />
      {state.date && (
        <div className="font-bold">
          {dayjs(state.date).format('YYYY년 MM월 DD일')}
        </div>
      )}
    </div>
  );
});
