import { OmitType } from '@nestjs/swagger';
import { TenancyDto } from './tenancy.dto';
import { COMMON_ENTITY_FIELDS } from 'src/shared/constants';

export class CreateTenancyDto extends OmitType(TenancyDto, COMMON_ENTITY_FIELDS) {}
