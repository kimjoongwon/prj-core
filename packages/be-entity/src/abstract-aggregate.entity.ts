import type { BaseEntityFields } from "@cocrepo/type";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

@AbstractEntityFields()
export abstract class AbstractAggregateEntity implements BaseEntityFields {
	id!: bigint;
	createdAt!: Date;
	updatedAt!: Date | null;
	removedAt!: Date | null;
}
