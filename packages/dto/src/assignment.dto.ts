import { ClassField, UUIDField } from "@cocrepo/decorator";
import { Assignment as AssignmentEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { RoleDto } from "./role.dto";
import { TenantDto } from "./tenant.dto";

export class AssignmentDto extends AbstractDto implements AssignmentEntity {
	@UUIDField()
	roleId: string;

	@UUIDField()
	tenantId: string;

	@ClassField(() => RoleDto, { required: false })
	role?: RoleDto;

	@ClassField(() => TenantDto, { required: false })
	tenant?: TenantDto;
}
