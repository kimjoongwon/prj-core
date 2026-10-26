import { UserClassification } from "@cocrepo/entity";
import { CategoryDto } from "./category.dto";
import { EntityResponseType } from "./mapped-types";
import { UserDto } from "./user.dto";

export class UserClassificationDto extends EntityResponseType(
	UserClassification,
	{
		pick: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"categoryId",
			"userId",
			"user",
			"category",
		] as const,
		relations: {
			user: () => UserDto,
			category: () => CategoryDto,
		},
	},
) {
	declare user?: UserDto;
	declare category?: CategoryDto;
}
