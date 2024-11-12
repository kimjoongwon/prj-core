import { Form } from '@shared/types';
import { Button } from '@shared/frontend/src/components/ui/Button';
import { APIManager } from '@Shared/frontend';
import { Toast } from '../toast';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormButtonProps {
  formButton: Form['button'];
  state: unknown;
}

export const FormButton = (props: FormButtonProps) => {
  const { formButton } = props;
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      if (formButton.flow?.mutation) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await APIManager?.[formButton.flow.mutation](state.form);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        Toast.show(formButton.flow?.failure?.message);
        navigate(formButton.flow?.failure?.pathname || '');
        return;
      }
    }

    Toast.show(formButton.flow?.success?.message);
    navigate(formButton.flow?.success?.pathname || '');
  };

  return (
    <Button fullWidth color={formButton.color} onClick={onClick}>
      {formButton.title}
    </Button>
  );
};
