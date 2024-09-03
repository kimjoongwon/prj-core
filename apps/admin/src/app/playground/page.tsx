'use client';

import { Button } from '@nextui-org/react';
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
      <Button onClick={() => state._count++}>UP</Button>
      <Button onClick={() => state._count--}>Down</Button>
      {state.count}
      {state._count}
    </div>
  );
});

export default PlayGroundPage;
