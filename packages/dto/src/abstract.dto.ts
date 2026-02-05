import { DateField, UUIDField } from "@cocrepo/decorator";

export class AbstractDto {
	@UUIDField()
	id!: string;

	@DateField()
	createdAt!: Date;

	@DateField()
	updatedAt!: Date;

	@DateField({ nullable: true })
	removedAt!: Date;
}
