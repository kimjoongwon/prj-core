import { ClassField, ULIDFieldOptional } from "@cocrepo/decorator";
import type { DomainEntityModel, UserClassification } from "@cocrepo/entity";
import { AbstractDto, CategoryDto, UserDto } from ".";

export class UserClassificationDto
	extends AbstractDto
	implements DomainEntityModel<UserClassification>
{
	@ULIDFieldOptional()
	categoryId: string;

	@ULIDFieldOptional()
	userId: string;

	@ClassField(() => UserDto, { required: false })
	user?: UserDto[];

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;
}
