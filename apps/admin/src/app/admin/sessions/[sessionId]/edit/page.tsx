'use client';

import React from 'react';
import { useSessionEditPage } from './hooks';
import { observer } from 'mobx-react-lite';
import { Spacer } from '@nextui-org/react';
import { FormControl, TimeRangePicker } from '@coc/ui';
import { Calendar } from '@components';

function Page() {
  const {
    schemas: { sessionFormSchema },
    state,
  } = useSessionEditPage();
  console.log({ ...state.form });
  return (
    <div className="md:flex">
      <div className="w-[400px] h-[400px]">
        <Calendar state={state.form} path="dates" />
      </div>
      <Spacer y={4} />
      <FormControl label="시작~종료">
        <TimeRangePicker />
      </FormControl>
    </div>
  );
}

export default observer(Page);
