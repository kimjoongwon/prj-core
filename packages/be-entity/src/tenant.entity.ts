import { AbstractEntity } from "./abstract.entity";
import type { Role } from "./role.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Tenant extends AbstractEntity {
	/** 공개 식별자 ULID */
	tenantId!: string;

	main!: boolean;
	spaceId!: bigint;
	userId!: bigint;
	roleId!: bigint;
	space?: Space;
	user?: User;
	role?: Role;
}
