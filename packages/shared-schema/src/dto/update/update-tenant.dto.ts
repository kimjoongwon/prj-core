import { PartialType } from "@nestjs/swagger";
import { CreateTenantDto } from "../create";
import { TenantDto } from "../tenant.dto";

export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
