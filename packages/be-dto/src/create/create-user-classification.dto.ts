import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { UserClassificationDto } from "../user-classification.dto";

export class CreateUserClassificationDto extends OmitType(
	UserClassificationDto,
	[...COMMON_ENTITY_FIELDS, "user", "category"],
) {}
