import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { TimelineDto } from '../timeline.dto';

export class CreateTimelineDto extends OmitType(TimelineDto, [...COMMON_ENTITY_FIELDS, 'tenant']) {}
