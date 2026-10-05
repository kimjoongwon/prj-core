import { AbstractEntity } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class AbstractDto extends PickType(AbstractEntity, [
	"id",
	"createdAt",
	"updatedAt",
	"removedAt",
] as const) {}
