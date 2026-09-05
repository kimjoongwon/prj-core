import { Category } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class CategoryDto extends EntityResponseType(Category, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"createdById",
		"name",
		"parentId",
		"parent",
		"children",
	] as const,
	relations: {
		parent: () => CategoryDto,
		children: () => CategoryDto,
	},
}) {
	declare parent?: CategoryDto;
	declare children?: CategoryDto[];
}
