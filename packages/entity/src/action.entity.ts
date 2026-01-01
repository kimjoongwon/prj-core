import { AbilityActions, Action as ActionEntity } from "@cocrepo/prisma";
import type { JsonValue } from "@cocrepo/type";
import { AbstractEntity } from "./abstract.entity";
import { Space } from "./space.entity";

export class Action extends AbstractEntity implements ActionEntity {
	spaceId!: string;
	name!: AbilityActions;
	conditions!: JsonValue | null;
	space?: Space;
}
