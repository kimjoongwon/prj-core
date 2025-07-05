import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constant';
import { SessionDto } from '../session.dto';
import { EnumField } from '../../decorator/field.decorators';
import { $Enums } from '@prisma/client';

export class CreateSessionDto extends OmitType(SessionDto, [...COMMON_ENTITY_FIELDS, 'type']) {
  @EnumField(() => $Enums.SessionTypes)
  type: $Enums.SessionTypes;
}
