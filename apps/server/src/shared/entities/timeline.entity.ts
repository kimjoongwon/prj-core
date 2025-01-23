import { UseDto } from '../decorators/use-dto.decorator';
import { TimelineDto } from '../dtos/timeline.dto';
import { AbstractEntity } from './abstract.entity';
import { Timeline as TimelineEntity } from '@prisma/client';

@UseDto(TimelineDto)
export class Timeline extends AbstractEntity<TimelineDto> implements TimelineEntity {
  name: string;
  tenancyId: string;
  startDateTime: Date;
  endDateTime: Date;
}
