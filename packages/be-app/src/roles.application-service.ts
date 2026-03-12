import { CreateRoleDto, UpdateRoleDto } from "@cocrepo/dto";
import { Role } from "@cocrepo/entity";
import { RolesService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RolesApplicationService {
	constructor(private readonly rolesService: RolesService) {}

	getAll() {
		return this.getRoles();
	}

	getRoles(): Promise<Role[]> {
		return this.rolesService.getAll();
	}

	getById(id: string): Promise<Role | null> {
		return this.getRoleById(id);
	}

	getRoleById(id: string): Promise<Role | null> {
		return this.rolesService.getById(id);
	}

	create(dto: CreateRoleDto): Promise<Role> {
		return this.createRole(dto);
	}

	createRole(dto: CreateRoleDto): Promise<Role> {
		return this.rolesService.create(dto);
	}

	update(id: string, dto: UpdateRoleDto): Promise<Role> {
		return this.updateRole(id, dto);
	}

	updateRole(id: string, dto: UpdateRoleDto): Promise<Role> {
		return this.rolesService.update(id, dto);
	}

	delete(id: string): Promise<Role> {
		return this.deleteRole(id);
	}

	deleteRole(id: string): Promise<Role> {
		return this.rolesService.delete(id);
	}
}
