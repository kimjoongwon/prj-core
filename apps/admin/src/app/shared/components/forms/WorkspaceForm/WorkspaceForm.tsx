'use client';

import { observer } from 'mobx-react-lite';
import { FormControl, Input, Select } from '@coc/ui';
import { WorkspaceForm as WorkspaceFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: WorkspaceFormType;
  schema: ZodSchema;
}

export const WorkspaceForm = observer((props: FormProps) => {
  const { state, schema } = props;

  return <div className="space-y-4"></div>;
});
