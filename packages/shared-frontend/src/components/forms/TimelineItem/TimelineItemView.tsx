'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Input, TimeRangePicker, VStack } from '../../ui';
import { CreateTimelineItemDto, UpdateTimelineItemDto } from '../../../model';

interface TimelineItemFormProps {
  state: CreateTimelineItemDto | UpdateTimelineItemDto;
}

export const TimelineItemForm = observer((props: TimelineItemFormProps) => {
  const { state } = props;
  return (
    <VStack className="w-full space-y-4">
      <Input label="제목" state={state} path="title" />
      <Input label="설명(에디터 교체)" state={state} path="description" />
      <TimeRangePicker
        state={state}
        startTimePath="startDateTime"
        endTimePath="endDateTime"
      />
      <Input label="장소" state={state} path="address" />
      <Input type="number" label="최소 인원" state={state} path="minCapacity" />
      <Input type="number" label="최대 인원" state={state} path="maxCapacity" />
    </VStack>
  );
});
