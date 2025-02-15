import { AbstractDto } from './abstract.dto';
import { ClassField, StringField, UUIDField } from '../decorators/field.decorators';
import { Timeline } from '@prisma/client';
import { TenantDto } from './tenant.dto';

export class TimelineDto extends AbstractDto implements Timeline {
  @StringField()
  label: string;

  @StringField()
  name: string;

  @UUIDField()
  tenantId: string;

  @ClassField(() => TenantDto)
  tenant?: TenantDto;
}
