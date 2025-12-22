import { UserClassification as UserClassificationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class UserClassification
	extends AbstractEntity
	implements UserClassificationEntity
{
	categoryId!: string;
	userId!: string;
}
