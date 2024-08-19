import { OmitType } from '@nestjs/swagger';
import { SessionDto } from './session.dto';
import { DateField } from '../../../decorators/field.decorators';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateSessionDto extends OmitType(SessionDto, [...COMMON_ENTITY_FIELDS, 'timelines']) {
  @DateField()
  timelineDates: Date[];
}
