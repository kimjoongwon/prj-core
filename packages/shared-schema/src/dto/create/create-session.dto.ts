import { OmitType } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { COMMON_ENTITY_FIELDS } from "../../constant";
import { EnumField } from "../../decorator/field.decorators";
import { SessionDto } from "../session.dto";

export class CreateSessionDto extends OmitType(SessionDto, [
	...COMMON_ENTITY_FIELDS,
	"type",
]) {
	@EnumField(() => $Enums.SessionTypes)
	type: $Enums.SessionTypes;
}
