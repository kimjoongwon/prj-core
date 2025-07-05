import { OmitType } from '@nestjs/swagger';
import { FileClassificationDto } from '../file-classification.dto';
import { COMMON_ENTITY_FIELDS } from '../../constant/entity-common-fields';

export class CreateFileClassificationDto extends OmitType(FileClassificationDto, [
  ...COMMON_ENTITY_FIELDS,
  'category',
  'file',
]) {}
