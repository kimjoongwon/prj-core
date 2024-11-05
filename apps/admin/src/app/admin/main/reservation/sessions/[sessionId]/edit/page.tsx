'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormLayout, SessionForm } from '@shared/frontend';
import { useSessionEditPage } from './_hooks/useSessionEditPage';
import dayjs from 'dayjs';

const SessionEditPage = observer(() => {
  const { leftButtons, rightButtons, state } = useSessionEditPage();

  return (
    <FormLayout
      title="세션"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <SessionForm state={state.form} />
      {state.timelineDates.map((date, index) => (
        <div key={index}>{dayjs(date).format('YYYY-MM-DD')}</div>
      ))}
    </FormLayout>
  );
});

export default SessionEditPage;
