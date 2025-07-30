import { PartialType } from "@nestjs/swagger";
import { CreateTenantDto } from "../create";

export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
