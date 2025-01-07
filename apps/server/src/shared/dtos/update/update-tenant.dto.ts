import { OmitType, PartialType } from '@nestjs/swagger';
import { TenantDto } from './tenant.dto';

export class UpdateTenantDto extends OmitType(PartialType(TenantDto), ['role', 'user', 'space']) {}
