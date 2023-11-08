---
to: src/app/shared/components/forms/<%= Name %>Form/<%= Name %>Form.tsx
---
'use client';

import { observer } from 'mobx-react-lite';
import { FormControl, Input, Select } from '@coc/ui';
import { <%= Name %>Form as <%= Name %>FormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: <%= Name %>FormType;
  schema: ZodSchema;
}

export const <%= Name %>Form = observer((props: FormProps) => {
  const { state, schema } = props;

  return (
    <div className="space-y-4">
    </div>
  );
});
