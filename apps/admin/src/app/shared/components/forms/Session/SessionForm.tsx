'use client';

import { observer } from 'mobx-react-lite';
import { SessionForm as SessionFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';
import { Calendar } from '@coc/ui';

interface FormProps {
  state: SessionFormType;
  schema: ZodSchema;
}

export const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

export const SessionForm = observer(() => {
  return (
    <div>
      <Calendar />
    </div>
  );
});
