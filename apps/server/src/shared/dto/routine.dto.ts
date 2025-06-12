import { Routine } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { StringField } from '../decorator/field.decorators';

export class RoutineDto extends AbstractDto implements Routine {
  @StringField()
  label: string;

  @StringField()
  name: string;
}
