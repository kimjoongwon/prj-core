'use client';

import { SessionForm as SessionFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';
import { Button, Calendar, Chips, FormControl, Input, Spacer } from '@coc/shared';
import dayjs from 'dayjs';

interface SessionFormProps {
  state: SessionFormType;
  schema: ZodSchema;
}

export const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

export const SessionForm = (props: SessionFormProps) => {
  const { schema, state } = props;

  return (
    <div>
      <FormControl schema={schema} label="세션명">
        <Input state={state} path="name" placeholder="세션명을 입력해주세요." />
      </FormControl>
      <Spacer y={2} />
      <Button
        variant="solid"
        onClick={() => {
          // modal.footer = (
          //   <Button onClick={() => (modal.isOpen = false)}>등록</Button>
          // );
          // modal.body = <Calendar state={state} path={'dates'} />;
          // modal.isOpen = !modal.isOpen;
        }}
      >
        날짜 선택
      </Button>
      <Spacer y={2} />
      <Chips
        data={state.dates.map(date => ({
          title: dayjs(date).format('YYYY-MM-DD'),
        }))}
      />
    </div>
  );
};
