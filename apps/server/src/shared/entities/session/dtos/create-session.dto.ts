import { OmitType } from '@nestjs/swagger';
import { SessionDto } from './session.dto';
import { DateField } from 'src/shared/decorators';
import { COMMON_ENTITY_FIELDS } from 'src/shared/constants';

export class CreateSessionDto extends OmitType(SessionDto, [...COMMON_ENTITY_FIELDS, 'timelines']) {
  @DateField()
  timelineDates: Date[];
}
