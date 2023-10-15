import { observer } from 'mobx-react-lite';
import { useSchema, useState } from '../PageProvider/hooks';
import { Card, FormControl, Input } from '@coc/ui';

interface FormProps {
  schema: ReturnType<typeof useSchema>;
  state: ReturnType<typeof useState>;
}
export const Form = observer((props: FormProps) => {
  const { state, schema } = props;
  return (
    <Card>
      <FormControl schema={schema} timings={['onBlur']}>
        <Input state={state} path="name" />
      </FormControl>
    </Card>
  );
});
