import { useForm } from '../../form/hooks/useForm';

export const usePage = () => {
  const form = useForm();
  return {
    form,
  };
};
