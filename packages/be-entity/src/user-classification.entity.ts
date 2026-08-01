import type { UserClassification as UserClassificationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";

export class UserClassification
	extends AbstractEntity
	implements DomainEntityModel<UserClassificationEntity>
{
	categoryId!: string;
	userId!: string;
}
