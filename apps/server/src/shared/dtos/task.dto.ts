import { Task as TaskEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { StringField, UUIDField } from '../decorators';

export class TaskDto extends AbstractDto implements TaskEntity {
  @StringField({
    label: '업무명',
    placeholder: '업무명을 입력해주세요',
  })
  name: string;

  @StringField({
    label: '업무 라벨',
    placeholder: '업무 라벨을 입력해주세요',
  })
  label: string;

  @UUIDField()
  contentId: string;
}
