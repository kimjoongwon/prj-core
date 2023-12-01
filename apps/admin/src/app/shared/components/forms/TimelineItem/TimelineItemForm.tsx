'use client';

import { TimelineItemForm as TimelineItemFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: TimelineItemFormType;
  schema: ZodSchema;
}

export const TimelineItemForm = (props: FormProps) => {
  const { state, schema } = props;

  return <div className="space-y-4"></div>;
};
