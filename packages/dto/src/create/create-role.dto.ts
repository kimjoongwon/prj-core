import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { UUIDField } from "@cocrepo/decorator";
import { RoleDto } from "../role.dto";

export class CreateRoleDto extends OmitType(RoleDto, [
	...COMMON_ENTITY_FIELDS,
	"classification",
	"associations",
]) {
	@UUIDField()
	serviceId: string;

	@UUIDField()
	categoryId: string;
}
