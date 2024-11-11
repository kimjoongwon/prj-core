import { Form } from '@shared/types';
import { Button } from '../Button';

interface FormButtonProps {
  formButton: Form['button'];
}

export const FormButton = (props: FormButtonProps) => {
  const {
    formButton: { color, title },
  } = props;

  return (
    <Button fullWidth color={color}>
      {title}
    </Button>
  );
};
