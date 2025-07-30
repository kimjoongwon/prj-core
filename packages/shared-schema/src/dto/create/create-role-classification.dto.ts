import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant/entity-common-fields";
import { RoleClassificationDto } from "../role-classification.dto";

export class CreateRoleClassificationDto extends OmitType(
	RoleClassificationDto,
	[...COMMON_ENTITY_FIELDS, "category", "role"],
) {}
