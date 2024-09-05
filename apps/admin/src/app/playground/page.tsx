'use client';

import { CalendarInput } from '@shared/frontend';
import dayjs from 'dayjs';
import { observer, useLocalObservable } from 'mobx-react-lite';

const PlayGroundPage = observer(() => {
  const state = useLocalObservable(() => ({
    dates: [
      dayjs().add(1, 'd').startOf('d').toDate(),
      dayjs().add(2, 'd').startOf('d').toDate(),
      dayjs().add(3, 'd').startOf('d').toDate(),
    ],
  }));

  return (
    <div className="w-full">
      <CalendarInput state={state} path="dates" />
    </div>
  );
});

export default PlayGroundPage;
