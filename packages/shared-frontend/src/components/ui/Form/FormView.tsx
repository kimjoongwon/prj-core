import { tv } from 'tailwind-variants';
import { Button } from '../Button';
import { FormProps } from './index';
import { Text } from '../Text';

interface FormViewProps extends FormProps {}

const formView = tv({
  base: 'space-y-4',
});

export const FormView = (props: FormViewProps) => {
  const { onSubmit, children, buttonProps, name } = props;

  return (
    <form
      onSubmit={onSubmit}
      className={formView({
        className: props.className,
      })}
    >
      <Text variant="h5">{name}</Text>
      {children}
      <Button {...buttonProps} />
    </form>
  );
};
