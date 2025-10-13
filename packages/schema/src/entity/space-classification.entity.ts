import { SpaceClassification as SpaceClassificationEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { SpaceClassificationDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";
import { Category } from "./category.entity";
import { Space } from "./space.entity";

@UseDto(SpaceClassificationDto)
export class SpaceClassification
	extends AbstractEntity<SpaceClassificationDto>
	implements SpaceClassificationEntity
{
	categoryId: string;
	spaceId: string;

	category?: Category;
	space?: Space;
}
