import type { TenantAccessRequestStatus } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Role } from "./role.entity";
import type { Space } from "./space.entity";
import type { Tenant } from "./tenant.entity";
import type { User } from "./user.entity";

export class TenantAccessRequest extends AbstractEntity {
	/** 공개 식별자 ULID */
	tenantAccessRequestId!: string;

	requesterId!: bigint;
	spaceId!: bigint;
	requestedRoleId!: bigint;
	previousRoleId!: bigint | null;
	reason!: string | null;
	status!: TenantAccessRequestStatus;
	reviewerId!: bigint | null;
	reviewComment!: string | null;
	reviewedAt!: Date | null;
	appliedTenantId!: bigint | null;
	requester?: User;
	reviewer?: User | null;
	space?: Space;
	requestedRole?: Role;
	previousRole?: Role | null;
	appliedTenant?: Tenant | null;
}
