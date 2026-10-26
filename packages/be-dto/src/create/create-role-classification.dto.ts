import { RoleClassification } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateRoleClassificationDto extends PickType(RoleClassification, [
	"roleId",
	"categoryId",
] as const) {}
