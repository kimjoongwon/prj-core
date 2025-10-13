import { ClassField, UUIDFieldOptional } from "../decorator";
import { UserClassification } from "../entity/user-classification.entity";
import { AbstractDto, CategoryDto, UserDto } from ".";

export class UserClassificationDto
	extends AbstractDto
	implements UserClassification
{
	@UUIDFieldOptional()
	categoryId: string;

	@UUIDFieldOptional()
	userId: string;

	@ClassField(() => UserDto, { required: false })
	user?: UserDto[];

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;
}
