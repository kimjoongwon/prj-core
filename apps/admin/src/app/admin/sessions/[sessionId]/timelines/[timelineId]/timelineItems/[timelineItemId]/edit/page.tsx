'use client';

import React from 'react';
import { TimelineItemForm } from '@components';
import { useTimelineItemEditPage } from './hooks';

export default function Page() {
  const {
    schemas: { timelineItemFormSchema },
    state,
  } = useTimelineItemEditPage();

  return (
    <TimelineItemForm state={state.form} schema={timelineItemFormSchema} />
  );
}
