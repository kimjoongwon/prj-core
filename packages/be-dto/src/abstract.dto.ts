import { DateField, ULIDField } from "@cocrepo/decorator";

export class AbstractDto {
	@ULIDField()
	id!: string;

	@DateField()
	createdAt!: Date;

	@DateField()
	updatedAt!: Date;

	@DateField({ nullable: true })
	removedAt!: Date;
}
