import { OmitType } from '@nestjs/swagger';
import { ServiceEntity } from '../service.entity';
import { COMMON_ENTITY_FIELDS } from '../../../constants';

export class CreateServiceDto extends OmitType(ServiceEntity, COMMON_ENTITY_FIELDS) {}
