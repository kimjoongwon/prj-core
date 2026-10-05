import type { Ability } from "@cocrepo/entity";

export type AbilityWithAssignment = Ability & {
	priority: number;
	assignmentCreatedAt?: Date;
};
