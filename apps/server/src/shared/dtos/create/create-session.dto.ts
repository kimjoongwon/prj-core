import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { SessionDto } from '../session.dto';
import { EnumField } from '../../decorators/field.decorators';
import { $Enums } from '@prisma/client';

export class CreateSessionDto extends OmitType(SessionDto, [...COMMON_ENTITY_FIELDS, 'type']) {
  @EnumField(() => $Enums.SessionTypes)
  type: $Enums.SessionTypes;
}
