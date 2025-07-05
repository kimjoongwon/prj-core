import { OmitType } from '@nestjs/swagger';
import { ServiceDto } from '../service.dto';
import { COMMON_ENTITY_FIELDS } from '../../constant/entity-common-fields';

export class CreateServiceDto extends OmitType(ServiceDto, [...COMMON_ENTITY_FIELDS, 'groups']) {}
