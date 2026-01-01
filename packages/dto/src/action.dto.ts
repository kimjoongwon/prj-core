import {
	ClassField,
	EnumField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { AbilityActions, Action } from "@cocrepo/prisma";
import { JsonValue } from "@cocrepo/type";
import { AbstractDto } from "./abstract.dto";
import { SpaceDto } from "./space.dto";

export class ActionDto extends AbstractDto implements Action {
	@UUIDField()
	spaceId: string;

	@EnumField(() => AbilityActions)
	name: AbilityActions;

	@StringFieldOptional()
	conditions: JsonValue | null;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;
}
