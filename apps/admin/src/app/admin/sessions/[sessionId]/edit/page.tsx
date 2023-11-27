'use client';

import React from 'react';
import { useSessionEditPage } from './hooks';
import { Calendar } from '../../../../shared/components/ui/Calendar';
import { observer } from 'mobx-react-lite';
import { Timelines } from '../../../../shared/components/ui/Timelines';
import { Spacer } from '@nextui-org/react';

function Page() {
  const {
    schemas: { sessionFormSchema },
    state,
  } = useSessionEditPage();

  return (
    <div className="md:flex">
      <Calendar state={state} path="form.endDateTime" />
      <Spacer y={4} />
      <Timelines className="grid grid-cols-7 gap-2" />
    </div>
  );
}

export default observer(Page);
