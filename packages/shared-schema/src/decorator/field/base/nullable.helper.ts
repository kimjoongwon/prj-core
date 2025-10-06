import { Transform } from "class-transformer";
import { NotEquals } from "class-validator";
import { IsNullable } from "../../validator.decorators";

export interface NullableOptions {
	/** null 허용 여부 */
	nullable?: boolean;
	/** 배열 여부 */
	each?: boolean;
	/** 문자열 "null"을 null로 변환할지 여부 (주로 StringField에서 사용) */
	transformStringNull?: boolean;
}

/**
 * nullable 처리 로직을 일관되게 적용하는 헬퍼 함수
 *
 * @param decorators - 데코레이터 배열 (참조로 전달되어 수정됨)
 * @param options - nullable 옵션
 */
export function applyNullableDecorators(
	decorators: PropertyDecorator[],
	options: NullableOptions,
): void {
	const { nullable, each, transformStringNull } = options;

	if (nullable) {
		// 문자열 "null"을 실제 null로 변환 (StringField 전용)
		if (transformStringNull) {
			decorators.push(
				Transform(({ value }) => (value === "null" ? null : value), {
					toClassOnly: true,
				}),
			);
		}
		decorators.push(IsNullable({ each }));
	} else {
		// null이 아니어야 함
		decorators.push(NotEquals(null, { each }));
	}
}
