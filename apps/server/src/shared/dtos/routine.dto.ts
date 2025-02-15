import { Routine } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, StringField, UUIDField } from '../decorators/field.decorators';
import { ContentDto } from './content.dto';

export class RoutineDto extends AbstractDto implements Routine {
  @StringField()
  label: string;

  @StringField()
  name: string;

  @UUIDField()
  contentId: string;

  @ClassField(() => ContentDto)
  content: ContentDto;
}
