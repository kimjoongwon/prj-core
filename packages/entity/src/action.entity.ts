import { AbilityActions, Action as ActionEntity } from "@cocrepo/prisma";
import type { JsonValue } from "@cocrepo/type";
import { AbstractEntity } from "./abstract.entity";

export class Action extends AbstractEntity implements ActionEntity {
	tenantId!: string;
	name!: AbilityActions;
	conditions!: JsonValue | null;
}
