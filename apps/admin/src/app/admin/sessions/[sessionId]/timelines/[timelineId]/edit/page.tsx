'use client';

import React from 'react';
import { TimelineForm } from '@components';
import { useTimelineEditPage } from './hooks';
import { observer } from 'mobx-react-lite';

function Page() {
  const {
    schemas: { timelineFormSchema },
    state,
  } = useTimelineEditPage();
  console.log(state.form);
  console.log(state.selectedTimelineItemIds);
  return (
    <TimelineForm
      selectedTimelineItemIds={state.selectedTimelineItemIds}
      state={state.form}
      schema={timelineFormSchema}
    />
  );
}

export default observer(Page);
