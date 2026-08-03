import { AbstractEntity } from "./abstract.entity";
import type { Category } from "./category.entity";
import type { Space } from "./space.entity";

export class SpaceClassification extends AbstractEntity {
	/** 공개 식별자 ULID */
	spaceClassificationId!: string;

	categoryId!: bigint;
	spaceId!: bigint;

	category?: Category;
	space?: Space;
}
