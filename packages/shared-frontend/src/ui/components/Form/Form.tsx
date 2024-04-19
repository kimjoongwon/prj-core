import { observer } from 'mobx-react-lite';
import { FormHTMLAttributes } from 'react';
import { CardBody, Card, CardHeader, CardFooter } from '@nextui-org/react';
import Button from '../Button';

interface FormProps<T> extends FormHTMLAttributes<HTMLFormElement> {
  state: T;
  schema: any;
  children: React.ReactNode;
  title: string;
  onClickSave: () => void;
  onClickCancel?: () => void;
}

export const FormLayout = observer(<T extends object>(porps: FormProps<T>) => {
  const {
    children,
    onClickSave,
    onClickCancel,
    schema,
    state,
    title,
    ...rest
  } = porps;

  return (
    <Card fullWidth>
      <CardHeader>
        <p className="text-large">{title}</p>
      </CardHeader>
      <CardBody>
        <form {...rest}>{children}</form>
      </CardBody>
      <CardFooter className="space-x-2">
        <Button
          isDisabled={!schema?.safeParse(state).success}
          onClick={onClickSave}
          color="primary"
        >
          저장
        </Button>
        <Button color="danger" onClick={onClickCancel}>
          취소
        </Button>
      </CardFooter>
    </Card>
  );
});
