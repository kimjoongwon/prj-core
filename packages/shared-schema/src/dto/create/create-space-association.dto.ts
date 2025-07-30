import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant/entity-common-fields";
import { SpaceAssociationDto } from "../space-association.dto";

export class CreateSpaceAssociationDto extends OmitType(SpaceAssociationDto, [
	...COMMON_ENTITY_FIELDS,
	"group",
]) {}
