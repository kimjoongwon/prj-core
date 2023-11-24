'use client';

import { observer } from 'mobx-react-lite';
import { Calendar } from '@coc/ui';
import { SessionForm as SessionFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: SessionFormType;
  schema: ZodSchema;
}

export const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

export const SessionForm = observer(() => {
  return (
    <div>
      <div>1</div>
      <div>2</div>
      <div>2</div>
      <div>3</div>
      <div>3</div>
      <div>3</div>
      <div>3</div>
      <div>3</div>
      <div>3</div>
      <div>3</div>
      <Calendar />
    </div>
  );
});
