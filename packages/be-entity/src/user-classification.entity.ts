import { AbstractEntity } from "./abstract.entity";

export class UserClassification extends AbstractEntity {
	/** 공개 식별자 ULID */
	userClassificationId!: string;

	categoryId!: bigint;
	userId!: bigint;
}
