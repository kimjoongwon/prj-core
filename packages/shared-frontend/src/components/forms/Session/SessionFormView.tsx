'use client';

import {
  CreateSessionDto,
  SessionTypes,
  UpdateSessionDto,
} from '../../../model';
import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { VStack } from '../../ui/VStack';
import { DatePicker } from '../../ui';
import { observer } from 'mobx-react-lite';

interface SessionFormViewProps {
  state: CreateSessionDto | UpdateSessionDto;
}
export const SessionFormView = observer((props: SessionFormViewProps) => {
  const { state } = props;
  const sessionOptions = [
    {
      text: '일회성',
      value: SessionTypes.ONE_TIME,
    },
    {
      text: '반복',
      value: SessionTypes.RECURRING,
    },
  ];

  return (
    <VStack className="space-y-2">
      <Input label="세센명" state={state} path="name" />
      <Select
        options={sessionOptions}
        label="세션 타입"
        state={state}
        path="type"
      />
      {state.type === 'ONE_TIME' && (
        <DatePicker label="날짜 선택" state={state} path="oneTimeDate" />
      )}
    </VStack>
  );
});
