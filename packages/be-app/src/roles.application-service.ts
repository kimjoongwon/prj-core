import { CreateRoleDto, UpdateRoleDto } from "@cocrepo/dto";
import { Role } from "@cocrepo/entity";
import { RolesService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RolesApplicationService {
	constructor(private readonly rolesService: RolesService) {}

	getRoles(): Promise<Role[]> {
		return this.rolesService.getAll();
	}

	getRoleById(id: string): Promise<Role | null> {
		return this.rolesService.getById(id);
	}

	createRole(dto: CreateRoleDto): Promise<Role> {
		return this.rolesService.create(dto);
	}

	updateRole(id: string, dto: UpdateRoleDto): Promise<Role> {
		return this.rolesService.update(id, dto);
	}

	deleteRole(id: string): Promise<Role> {
		return this.rolesService.delete(id);
	}
}
