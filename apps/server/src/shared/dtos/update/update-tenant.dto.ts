import { PartialType } from '@nestjs/swagger';
import { TenantDto } from '../tenant.dto';
import { CreateTenantDto } from '../create';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
