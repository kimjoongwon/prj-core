import { RoleClassification } from "@cocrepo/entity";
import { CategoryDto } from "./category.dto";
import { EntityResponseType } from "./mapped-types";
import { RoleDto } from "./role.dto";

export class RoleClassificationDto extends EntityResponseType(
	RoleClassification,
	{
		pick: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"roleId",
			"categoryId",
			"category",
			"role",
		] as const,
		relations: {
			category: () => CategoryDto,
			role: () => RoleDto,
		},
	},
) {
	declare category?: CategoryDto;
	declare role?: RoleDto;
}
