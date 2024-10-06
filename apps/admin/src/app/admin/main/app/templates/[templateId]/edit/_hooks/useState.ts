import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';
import { galaxy, TemplateDto } from '@shared/frontend';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    data: {
      getTemplate: { data: responseEntity },
    },
  } = props;

  const templateDto = responseEntity?.data || {
    name: 'EMAIL_VERIFICATION',
    post: {
      title: '',
      content: '',
      type: 'HTML',
      authorId: galaxy.auth.user?.id,
    },
  };

  const state = useLocalObservable<{ form: Partial<TemplateDto> }>(() => ({
    form: templateDto,
  }));

  return state;
};
