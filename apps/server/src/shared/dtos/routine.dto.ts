import { Routine } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { StringField, UUIDField } from '../decorators/field.decorators';

export class RoutineDto extends AbstractDto implements Routine {
  @StringField()
  name: string;

  @UUIDField()
  contentId: string;

  @UUIDField()
  tenancyId: string;
}
