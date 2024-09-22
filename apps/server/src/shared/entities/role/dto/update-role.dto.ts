import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { RoleDto } from './role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
