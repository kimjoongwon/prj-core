import { UserClassification as UserClassificationEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";

export class UserClassification extends AbstractEntity implements UserClassificationEntity {
	categoryId!: string;
	userId!: string;
}
