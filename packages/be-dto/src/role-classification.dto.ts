import { ClassField, ULIDField } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { RoleClassification } from "@cocrepo/prisma";
import { AbstractDto, CategoryDto, RoleDto } from ".";

export class RoleClassificationDto
	extends AbstractDto
	implements DomainEntityModel<RoleClassification>
{
	@ULIDField()
	roleId: string;

	@ULIDField()
	categoryId: string;

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;

	@ClassField(() => RoleDto, { required: false })
	role?: RoleDto;
}
