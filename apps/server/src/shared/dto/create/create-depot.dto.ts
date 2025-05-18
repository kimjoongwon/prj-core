import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constant/entity-common-fields';
import { DepotDto } from '../depot.dto';

export class CreateDepotDto extends OmitType(DepotDto, [...COMMON_ENTITY_FIELDS, 'files']) {}
