import { CreateTemplateDto, galaxy, UpdateTemplateDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    context: { isEditMode },
    data: { getTemplate },
  } = props;

  const defaultForm: CreateTemplateDto = {
    htmlContent: '',
    name: 'WELCOME',
  };

  const form = isEditMode ? getTemplate.data?.data! : defaultForm;

  const state = useLocalObservable<{
    form: CreateTemplateDto | UpdateTemplateDto;
  }>(() => ({
    form,
  }));

  return state;
};
