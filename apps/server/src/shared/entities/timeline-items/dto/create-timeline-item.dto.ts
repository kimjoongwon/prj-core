import { OmitType } from '@nestjs/swagger';
import { TimelineItemDto } from './timeline-item.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateTimelineItemDto extends OmitType(TimelineItemDto, [
  ...COMMON_ENTITY_FIELDS,
  'reservations',
  'timeline',
]) {}
