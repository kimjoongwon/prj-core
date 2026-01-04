import type {
	AbilityActions,
	Ability as AbilityEntity,
	AbilityTypes,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Role } from "./role.entity";
import type { Subject } from "./subject.entity";

export class Ability extends AbstractEntity implements AbilityEntity {
	type!: AbilityTypes;
	action!: AbilityActions;
	roleId!: string;
	description!: string | null;
	conditions!: Record<string, unknown> | null;
	subjectId!: string;
	tenantId!: string;
	isActive!: boolean;
	role?: Role;
	subject?: Subject;
}
