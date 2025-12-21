import { SpaceClassification as SpaceClassificationEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Category } from "./category.entity";
import { Space } from "./space.entity";

export class SpaceClassification extends AbstractEntity implements SpaceClassificationEntity {
	categoryId!: string;
	spaceId!: string;

	category?: Category;
	space?: Space;
}
