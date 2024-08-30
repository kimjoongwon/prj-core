import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from 'src/shared/constants';
import { TimelineItemDto } from './timeline-item.dto';

export class CreateTimelineItemDto extends OmitType(TimelineItemDto, [
  ...COMMON_ENTITY_FIELDS,
  'reservations',
  'timeline',
]) {}
