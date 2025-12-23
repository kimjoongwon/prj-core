import type { BaseEntityFields, Constructor } from "@cocrepo/type";
import { plainToInstance } from "class-transformer";

/**
 * 모든 엔티티의 기본 클래스
 * DTO 변환 기능을 제공합니다
 *
 * @template DTO - 변환할 DTO 타입
 * @template O - toDto 옵션 타입
 */
export class AbstractEntity<DTO = unknown, O = never>
	implements BaseEntityFields
{
	id!: string;
	seq!: number;
	createdAt!: Date;
	updatedAt!: Date | null;
	removedAt!: Date | null;

	private dtoClass?: Constructor<DTO>;

	/**
	 * @deprecated DtoTransformInterceptor가 자동으로 Entity → DTO 변환을 처리합니다.
	 * Controller에서 직접 호출하지 마세요. 이 메서드는 하위 호환성을 위해 유지되며, 향후 제거될 예정입니다.
	 *
	 * @see DtoTransformInterceptor - 자동 DTO 변환을 담당하는 Interceptor
	 */
	toDto?(options?: O): DTO {
		console.warn(
			"[DEPRECATED] toDto()는 deprecated되었습니다. DtoTransformInterceptor가 자동으로 변환을 처리합니다.",
		);

		if (!this.dtoClass) {
			throw new Error(
				"dtoClass가 설정되지 않았습니다. @UseDto 데코레이터를 사용하세요.",
			);
		}
		return plainToInstance(
			this.dtoClass,
			this,
			options as any,
		) as unknown as DTO;
	}
}
