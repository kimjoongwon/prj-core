'use client';

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
import { Text } from '../../ui/Text';
import { v4 } from 'uuid';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  title: string;
  leftButtons?: ButtonProps[];
  rightButtons?: ButtonProps[];
}

export const FormLayout = observer((props: FormProps) => {
  const { children, title, leftButtons, rightButtons } = props;

  const renderButton = (props: ButtonProps) => <Button key={v4()} {...props} />;

  return (
    <Card fullWidth>
      <CardHeader>
        <Text variant="h3">{title}</Text>
      </CardHeader>
      <CardBody>{children}</CardBody>
      <CardFooter className="space-x-2 justify-between">
        <div>{leftButtons?.map(renderButton)}</div>
        <div>{rightButtons?.map(renderButton)}</div>
      </CardFooter>
    </Card>
  );
});
