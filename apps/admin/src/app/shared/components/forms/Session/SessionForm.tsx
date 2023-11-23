'use client';

import { observer } from 'mobx-react-lite';
import { Card, CardBody, CardHeader } from '@coc/ui';
import { SessionForm as SessionFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';
import dayjs from 'dayjs';
import { range } from 'lodash-es';

interface FormProps {
  state: SessionFormType;
  schema: ZodSchema;
}

export const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

export const SessionForm = observer((props: FormProps) => {
  const { state, schema } = props;

  const date = dayjs('2023-11-23').daysInMonth();
  const startOfMonthDay = dayjs().startOf('M').day();
  const endOfMonthDay = 7 - dayjs().endOf('M').day();

  return (
    <div className="flex gap-2">
      <Card fullWidth>
        <CardHeader>Timeline</CardHeader>
        <CardBody>
          <div className="grid grid-cols-7 grid-flow-row">
            {DAYS.map(day => (
              <div>{day}</div>
            ))}
            {range(0, 35).map(value => {
              return (
                <div>
                  {value >= startOfMonthDay && value <= 35 - endOfMonthDay
                    ? value - startOfMonthDay + 1
                    : ''}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
});
