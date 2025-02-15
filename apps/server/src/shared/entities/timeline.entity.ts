import { UseDto } from '../decorators/use-dto.decorator';
import { TimelineDto } from '../dtos/timeline.dto';
import { AbstractEntity } from './abstract.entity';
import { Timeline as TimelineEntity } from '@prisma/client';
import { Tenant } from './tenant.entity';

@UseDto(TimelineDto)
export class Timeline extends AbstractEntity<TimelineDto> implements TimelineEntity {
  name: string;
  label: string;
  tenantId: string;
  tenant?: Tenant;
}
