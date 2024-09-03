'use client';

import { Button } from '@nextui-org/react';
import { CalendarInput } from '@shared/frontend';
import { observer, useLocalObservable } from 'mobx-react-lite';

const PlayGroundPage = observer(() => {
  const _state = useLocalObservable(() => ({
    _count: 0,
  }));
  const state = useLocalObservable(() => ({
    count: 0,
    ..._state,
  }));

  return (
    <div className="w-[300px]">
      <CalendarInput />
    </div>
  );
});

export default PlayGroundPage;
