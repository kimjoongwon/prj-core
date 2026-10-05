import { RoleClassification } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateRoleClassificationDto extends PartialType(
	PickType(RoleClassification, ["roleId", "categoryId"] as const),
) {}
