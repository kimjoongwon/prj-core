import { ClassField, UUIDField } from "@cocrepo/decorator";
import { RoleClassification } from "@cocrepo/prisma";
import { AbstractDto, CategoryDto, RoleDto } from ".";

export class RoleClassificationDto
	extends AbstractDto
	implements RoleClassification
{
	@UUIDField()
	roleId: string;

	@UUIDField()
	categoryId: string;

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;

	@ClassField(() => RoleDto, { required: false })
	role?: RoleDto;
}
