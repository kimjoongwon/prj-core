'use client';

import { Button, Input, Select, Spacer } from '@coc/shared';
import { Table, TableCell, TableHeader, TableRow } from '@nextui-org/react';
import dayjs from 'dayjs';
import { range } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { HTMLAttributes } from 'react';

interface TimelinesProps {
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export const Timelines = observer((props: TimelinesProps) => {
  const { className } = props;
  const startTime = dayjs().startOf('d');
  const endTime = dayjs().endOf('d');

  const startMin = startTime.hour() * 60;
  const endMin = endTime.hour() * 60;

  const localState = useLocalObservable(() => ({
    interval: 30,
  }));

  const intervalOptions = range(0, 365)
    .filter(value => value % 10 === 0)
    .map(min => ({
      name: min + '분',
      value: min,
    }));

  return (
    <form>
      <input
        style={{ width: '110px' }}
        type="time"
        onChange={e => console.log(e.target.value)}
        value={'12:00'}
      />

      {/* <Select
        label="수업 간격 설정"
        size="sm"
        state={localState}
        path="interval"
        options={intervalOptions}
        />
        <Spacer />
        <div className={className}>
        {range(startMin, endMin)
          .filter(min => min % localState.interval === 0)
          .map(min => (
            <Button variant="bordered" className="min-w-0">
            {startTime.minute(min).format('HH:mm')}
            </Button>
            ))}
          </div> */}
      <Button>예약 생성</Button>
    </form>
  );
});
