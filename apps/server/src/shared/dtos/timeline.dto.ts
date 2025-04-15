import { AbstractDto } from './abstract.dto';
import { ClassField, UUIDField } from '../decorators/field.decorators';
import { Timeline } from '@prisma/client';
import { TenantDto } from './tenant.dto';

export class TimelineDto extends AbstractDto implements Timeline {
  @UUIDField()
  tenantId: string;

  @ClassField(() => TenantDto)
  tenant?: TenantDto;
}
