import { OmitType } from '@nestjs/swagger';
import { RoutineDto } from '../routine.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { EnumField, StringFieldOptional } from '../../decorators';
import { $Enums } from '@prisma/client';

export class CreateRoutineDto extends OmitType(RoutineDto, [...COMMON_ENTITY_FIELDS, 'contentId']) {
  @StringFieldOptional({ nullable: true })
  title: string | null;

  @StringFieldOptional({ nullable: true })
  description: string | null;

  @EnumField(() => $Enums.TextTypes, { nullable: true, default: $Enums.TextTypes.Textarea })
  type: $Enums.TextTypes;

  @StringFieldOptional({ nullable: true })
  text: string;
}
