import { RoleClassification } from "@prisma/client";
import { ClassField, UUIDField } from "../decorator";
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
