'use client';

import { TimelineItemForm as TimelineItemFormType } from '@__generated__/graphql';
import { Input, TimeRangePicker } from '@coc/shared';
import { ZodSchema } from 'zod';

interface FormProps {
  state: TimelineItemFormType;
  schema: ZodSchema;
}

export const TimelineItemForm = (props: FormProps) => {
  const { state, schema } = props;

  return (
    <div className="space-y-4">
      <Input state={state} path="title" placeholder="타임라인블럭" />
      <Input state={state} path="description" placeholder="타임라인블럭 설명" />
      <TimeRangePicker
        state={state}
        startTimePath="startDateTime"
        endTimePath="endDateTime"
      />
      <Input
        type="number"
        state={state}
        path="maxCapacity"
        placeholder="약속인원"
      />
      <Input
        type="number"
        state={state}
        path="minCapacity"
        placeholder="최소인원"
      />
    </div>
  );
};
