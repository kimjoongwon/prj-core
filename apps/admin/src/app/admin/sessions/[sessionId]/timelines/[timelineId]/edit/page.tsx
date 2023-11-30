'use client';

import React from 'react';
import { TimelineForm } from '@components';
import { useTimelineEditPage } from './hooks';

export default function Page() {
  const {
    schemas: { timelineFormSchema },
    state,
  } = useTimelineEditPage();

  return <TimelineForm state={state.form} schema={timelineFormSchema} />;
}
