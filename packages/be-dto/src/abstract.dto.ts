import { BigIntIdField, DateField } from "@cocrepo/decorator/field";

export class AbstractDto {
	@BigIntIdField()
	id!: bigint;

	@DateField()
	createdAt!: Date;

	@DateField()
	updatedAt!: Date;

	@DateField({ nullable: true })
	removedAt!: Date;
}
