import { SpaceClassification } from "@cocrepo/entity";
import { CategoryDto } from "./category.dto";
import { EntityResponseType } from "./mapped-types";
import { SpaceDto } from "./space.dto";

export class SpaceClassificationDto extends EntityResponseType(
	SpaceClassification,
	{
		pick: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceId",
			"categoryId",
			"category",
			"space",
		] as const,
		relations: {
			category: () => CategoryDto,
			space: () => SpaceDto,
		},
	},
) {
	declare category?: CategoryDto;
	declare space?: SpaceDto;
}
