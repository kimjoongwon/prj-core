import { Timeline } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { DateField, StringField, UUIDField } from '../decorators/field.decorators';

export class TimelineDto extends AbstractDto implements Timeline {
  @StringField()
  name: string;

  @UUIDField()
  tenancyId: string;

  @UUIDField()
  tenantId: string;

  @DateField()
  startDateTime: Date;

  @DateField()
  endDateTime: Date;
}
