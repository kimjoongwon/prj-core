import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { TimelineDto } from '../timeline.dto';
import { StringField } from '../../decorators';

export class CreateTimelineDto extends OmitType(TimelineDto, [...COMMON_ENTITY_FIELDS]) {
  @StringField({ each: true })
  sessionIds: string[];
}
