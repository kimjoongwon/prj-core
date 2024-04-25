import { observer } from 'mobx-react-lite';
import { FormHTMLAttributes } from 'react';
import { CardBody, Card, CardHeader, CardFooter } from '@nextui-org/react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  title: string;
  leftButtons?: () => React.ReactNode[];
  rightButtons?: () => React.ReactNode;
}

export const FormLayout = observer((props: FormProps) => {
  const { children, title } = props;

  return (
    <Card fullWidth>
      <CardHeader>
        <p className="text-large">{title}</p>
      </CardHeader>
      <CardBody>{children}</CardBody>
      <CardFooter className="space-x-2 justify-between">
        <div>{props.leftButtons && props.leftButtons()}</div>
        <div>{props.rightButtons && props.rightButtons()}</div>
      </CardFooter>
    </Card>
  );
});
