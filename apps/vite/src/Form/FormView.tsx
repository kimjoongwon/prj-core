import { tv } from 'tailwind-variants';
import { FormProps } from './index';
import { FormButton } from './FormButton';
import { Text } from '@shared/frontend';

type FormViewProps = FormProps;

const formView = tv({
  base: 'space-y-4',
});

export const FormView = (props: FormViewProps) => {
  const { onSubmit, children, form, state } = props;

  return (
    <form
      onSubmit={onSubmit}
      className={formView({
        className: props.className,
      })}
    >
      <Text variant="h5">{form?.name}</Text>
      {children}
      {form?.button && <FormButton formButton={form?.button} state={state} />}
    </form>
  );
};
