import { CreateTemplateDto, galaxy, UpdateTemplateDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    data: { getTemplate },
  } = props;
  const templateDto = getTemplate.data?.data;

  const updateTemplateDto: UpdateTemplateDto = {
    id: '',
    name: 'WELCOME',
    keys: [],
    postId: '',
    serviceId: '',
    ...templateDto,
    updatePostDto: {
      id: '',
      content: '',
      authorId: '',
      serviceId: '',
      title: '',
      type: 'HTML',
    },
  };

  const state = useLocalObservable<{
    form: UpdateTemplateDto;
  }>(() => ({
    form: updateTemplateDto,
  }));

  return state;
};
