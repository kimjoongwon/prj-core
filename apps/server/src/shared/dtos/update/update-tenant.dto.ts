import { PartialType } from '@nestjs/swagger';
import { TenantDto } from '../tenant.dto';

export class UpdateTenantDto extends PartialType(TenantDto) {}
