import { Button } from '@shared/frontend';
import { Form } from '@shared/types';

interface AdminButtonProps {
  adminButton: Form['button'];
}

export const AdminButton = (props: AdminButtonProps) => {
  const {
    adminButton: { color, title },
  } = props;
  console.log('AdminButton', props);
  return <Button color={color}>{title}</Button>;
};
