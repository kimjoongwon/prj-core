import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../../constants';
import { ServiceDto } from './service.dto';

export class CreateServiceDto extends OmitType(ServiceDto, COMMON_ENTITY_FIELDS) {}
