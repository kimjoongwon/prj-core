import { tv } from 'tailwind-variants';
import { Button } from '../Button';
import { FormProps } from './index';
import { Text } from '../Text';
import { FormButton } from './FormButton';

interface FormViewProps extends FormProps {}

const formView = tv({
  base: 'space-y-4',
});

export const FormView = (props: FormViewProps) => {
  const { onSubmit, children, form } = props;

  return (
    <form
      onSubmit={onSubmit}
      className={formView({
        className: props.className,
      })}
    >
      <Text variant="h5">{form.name}</Text>
      {children}
      <FormButton formButton={form.button} />
    </form>
  );
};
