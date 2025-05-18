import { UseDto } from '../decorator/use-dto.decorator';
import { TimelineDto } from '../dto/timeline.dto';
import { AbstractEntity } from './abstract.entity';
import { Timeline as TimelineEntity } from '@prisma/client';
import { Tenant } from './tenant.entity';

@UseDto(TimelineDto)
export class Timeline extends AbstractEntity<TimelineDto> implements TimelineEntity {
  tenantId: string;
  tenant?: Tenant;
}
