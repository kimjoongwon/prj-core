import type { BaseEntityFields, Constructor } from "@cocrepo/type";
import { AggregateRoot } from "@nestjs/cqrs";
import { ClassTransformOptions, plainToInstance } from "class-transformer";

export abstract class AbstractAggregateEntity<DTO = unknown, O = never>
	extends AggregateRoot
	implements BaseEntityFields
{
	id!: bigint;
	createdAt!: Date;
	updatedAt!: Date | null;
	removedAt!: Date | null;

	private dtoClass?: Constructor<DTO>;

	toDto?(options?: O): DTO {
		if (!this.dtoClass) {
			throw new Error(
				"dtoClass가 설정되지 않았습니다. @UseDto 데코레이터를 사용하세요.",
			);
		}

		return plainToInstance(
			this.dtoClass,
			this,
			options as ClassTransformOptions,
		) as unknown as DTO;
	}
}
