import { observer } from 'mobx-react-lite';
import { useSchema, useState } from '../PageProvider/hooks';
import { Card, CardBody, CardHeader, FormControl, Input } from '@coc/ui';

interface FormProps {
  schema: ReturnType<typeof useSchema>;
  state: ReturnType<typeof useState>;
}
export const Form = observer((props: FormProps) => {
  const { state, schema } = props;

  return (
    <Card fullWidth>
      <CardHeader>
        <p className="text-large">카테고리</p>
      </CardHeader>
      <CardBody>
        <FormControl schema={schema} timings={['onBlur']}>
          <Input label="서비스 분류명" state={state} path="name" />
        </FormControl>
      </CardBody>
    </Card>
  );
});
