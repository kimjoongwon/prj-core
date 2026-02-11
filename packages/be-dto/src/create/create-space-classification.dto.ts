import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { SpaceClassificationDto } from "../space-classification.dto";

export class CreateSpaceClassificationDto extends OmitType(
	SpaceClassificationDto,
	[...COMMON_ENTITY_FIELDS, "category", "space"],
) {}
