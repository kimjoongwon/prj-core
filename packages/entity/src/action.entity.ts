import { Action as ActionEntity, AbilityActions } from "@cocrepo/prisma";
import type { JsonValue } from "./types/json";
import { AbstractEntity } from "./abstract.entity";

export class Action extends AbstractEntity implements ActionEntity {
	tenantId!: string;
	name!: AbilityActions;
	conditions!: JsonValue | null;
}
