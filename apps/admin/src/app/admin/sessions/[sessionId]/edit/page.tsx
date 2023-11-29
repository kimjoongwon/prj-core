'use client';

import React from 'react';
import { useSessionEditPage } from './hooks';
import { observer } from 'mobx-react-lite';
import { Spacer } from '@nextui-org/react';
import { FormControl, TimePicker, TimeRangePicker } from '@coc/ui';

function Page() {
  const {
    schemas: { sessionFormSchema },
    state,
  } = useSessionEditPage();

  return (
    <div>
      {/* <Calendar state={state} path="form.endDateTime" /> */}
      <Spacer y={4} />
      <FormControl label="시작~종료">
        <TimeRangePicker />
      </FormControl>
    </div>
  );
}

export default observer(Page);
