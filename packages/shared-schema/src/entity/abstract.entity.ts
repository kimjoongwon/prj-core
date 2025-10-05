import { plainToInstance } from "class-transformer";
import { Constructor } from "../decorator/use-dto.decorator";
import { AbstractDto } from "../dto/abstract.dto";

export class AbstractEntity<DTO extends AbstractDto, O = never> {
	id: string;
	seq: number;
	createdAt: Date;
	updatedAt: Date | null;
	removedAt: Date | null;

	private dtoClass?: Constructor<any, any>;

	toDto?(options?: O): DTO {
		return plainToInstance(
			// @ts-expect-error
			this.dtoClass,
			this,
			options as any,
		) as unknown as DTO;
	}
}
