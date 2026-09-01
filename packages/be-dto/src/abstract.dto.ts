import { BigIntIdField, DateField } from "@cocrepo/decorator/field";

export class AbstractDto {
	@BigIntIdField()
	id!: bigint;

	@DateField()
	createdAt!: Date;

	@DateField({ nullable: true })
	updatedAt!: Date | null;

	@DateField({ nullable: true })
	removedAt!: Date | null;
}
