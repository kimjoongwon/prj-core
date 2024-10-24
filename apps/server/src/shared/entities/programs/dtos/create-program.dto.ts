import { OmitType } from '@nestjs/swagger';
import { ProgramDto } from './program.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateProgramDto extends OmitType(ProgramDto, [
  ...COMMON_ENTITY_FIELDS,
  'timelineItem',
  'post',
]) {}
