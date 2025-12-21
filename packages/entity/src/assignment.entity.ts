import { Assignment as AssignmentEntity, Role, Tenant } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";

export class Assignment extends AbstractEntity implements AssignmentEntity {
	roleId!: string;
	tenantId!: string;

	role?: Role;
	tenant?: Tenant;
}
