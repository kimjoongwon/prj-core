import {
  CreateTemplateDto,
  TemplateDto,
  UpdateTemplateDto,
} from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { makeAutoObservable } from 'mobx';
import { useData } from './useData';
import { useContext } from './useContext';
import { plainToInstance } from 'class-transformer';

class Template {
  constructor() {
    makeAutoObservable(this);
  }
  form: Partial<TemplateDto> = {
    name: 'EMAIL_VERIFICATION',
    post: {
      authorId: '',
      content: '',
      title: '',
      type: 'HTML',
    },
    createdAt: '',
    id: '',
    postId: '',
    removedAt: '',
    updatedAt: '',
  };

  toUpdateDto(): UpdateTemplateDto {
    return this.form as UpdateTemplateDto;
  }
  toCreateDto(): CreateTemplateDto {
    const createTemplateDto: CreateTemplateDto = {
      name: 'EMAIL_VERIFICATION',
      post: {
        authorId: '',
        content: '',
        title: '',
        type: 'HTML',
      },
    };
    return createTemplateDto;
  }
}

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    data: {
      getTemplate: { data: responseEntity },
    },
    context: { isEditMode },
  } = props;

  const templateDto = responseEntity?.data;
  const template = plainToInstance(Template, templateDto);

  const state = useLocalObservable(() => ({
    form: isEditMode ? template.toUpdateDto() : template.toCreateDto(),
  }));

  return state;
};
