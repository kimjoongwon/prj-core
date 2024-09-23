import { OmitType } from '@nestjs/swagger';
import { TimelineDto } from './timeline.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants';

export class CreateTimelineDto extends OmitType(TimelineDto, [
  ...COMMON_ENTITY_FIELDS,
  'timelineItem',
]) {}
