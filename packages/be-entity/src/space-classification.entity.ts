import type { SpaceClassification as SpaceClassificationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Category } from "./category.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Space } from "./space.entity";

export class SpaceClassification
	extends AbstractEntity
	implements DomainEntityModel<SpaceClassificationEntity>
{
	categoryId!: string;
	spaceId!: string;

	category?: Category;
	space?: Space;
}
