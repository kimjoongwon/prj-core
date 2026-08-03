import { AbstractEntity } from "./abstract.entity";
import type { RoleAssignment } from "./role-assignment.entity";

export class Role extends AbstractEntity {
	/** 공개 식별자 ULID */
	roleId!: string;

	name!: string;
	displayName!: string | null;
	description!: string | null;
	assignments?: RoleAssignment[];
}
