import { plainToInstance } from "class-transformer";
import type { Constructor, BaseEntityFields } from "@cocrepo/types";

/**
 * 모든 엔티티의 기본 클래스
 * DTO 변환 기능을 제공합니다
 *
 * @template DTO - 변환할 DTO 타입
 * @template O - toDto 옵션 타입
 */
export class AbstractEntity<DTO = unknown, O = never> implements BaseEntityFields {
	id!: string;
	seq!: number;
	createdAt!: Date;
	updatedAt!: Date | null;
	removedAt!: Date | null;

	private dtoClass?: Constructor<DTO>;

	/**
	 * 엔티티를 DTO로 변환합니다
	 */
	toDto?(options?: O): DTO {
		if (!this.dtoClass) {
			throw new Error("dtoClass가 설정되지 않았습니다. @UseDto 데코레이터를 사용하세요.");
		}
		return plainToInstance(
			this.dtoClass,
			this,
			options as any
		) as unknown as DTO;
	}
}
