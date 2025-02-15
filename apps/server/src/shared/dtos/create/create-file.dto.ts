import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { FileDto } from '../file.dto';

export class CreateFileDto extends OmitType(FileDto, [...COMMON_ENTITY_FIELDS, 'tenant']) {}
