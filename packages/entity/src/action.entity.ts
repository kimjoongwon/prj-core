import { AbilityActions, Action as ActionEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { JsonValue } from "./types/json";

export class Action extends AbstractEntity implements ActionEntity {
	tenantId!: string;
	name!: AbilityActions;
	conditions!: JsonValue | null;
}
