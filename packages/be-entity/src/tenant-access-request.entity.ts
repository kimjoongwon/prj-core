import type {
	TenantAccessRequest as TenantAccessRequestEntity,
	TenantAccessRequestStatus,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Role } from "./role.entity";
import type { Space } from "./space.entity";
import type { Tenant } from "./tenant.entity";
import type { User } from "./user.entity";

export class TenantAccessRequest
	extends AbstractEntity
	implements DomainEntityModel<TenantAccessRequestEntity>
{
	requesterId!: string;
	spaceId!: string;
	requestedRoleId!: string;
	previousRoleId!: string | null;
	reason!: string | null;
	status!: TenantAccessRequestStatus;
	reviewerId!: string | null;
	reviewComment!: string | null;
	reviewedAt!: Date | null;
	appliedTenantId!: string | null;
	requester?: User;
	reviewer?: User | null;
	space?: Space;
	requestedRole?: Role;
	previousRole?: Role | null;
	appliedTenant?: Tenant | null;
}
