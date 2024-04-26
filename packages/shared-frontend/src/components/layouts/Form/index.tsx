import { observer } from 'mobx-react-lite';
import { FormHTMLAttributes } from 'react';
import {
  CardBody,
  Card,
  CardHeader,
  CardFooter,
  ButtonProps,
  Button,
} from '@nextui-org/react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  title: string;
  leftButtons?: ButtonProps[];
  rightButtons?: ButtonProps[];
}

export const FormLayout = observer((props: FormProps) => {
  const { children, title, leftButtons, rightButtons } = props;

  const renderButton = (props: ButtonProps) => <Button {...props} />;

  return (
    <Card fullWidth>
      <CardHeader>
        <p className="text-large">{title}</p>
      </CardHeader>
      <CardBody>{children}</CardBody>
      <CardFooter className="space-x-2 justify-between">
        <div>{leftButtons?.map(renderButton)}</div>
        <div>{rightButtons?.map(renderButton)}</div>
      </CardFooter>
    </Card>
  );
});
