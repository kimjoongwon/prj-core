import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { SpaceDto } from "../space.dto";

export class CreateSpaceDto extends OmitType(SpaceDto, [
	...COMMON_ENTITY_FIELDS,
	"spaceClassification",
	"spaceAssociations",
	"ground",
	"tenants",
]) {}
