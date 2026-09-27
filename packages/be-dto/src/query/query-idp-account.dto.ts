import {
	BooleanFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { UserStatus } from "@cocrepo/entity";
import { Transform } from "class-transformer";
import { EntityQueryType } from "./entity-query-type";

// isActive 필터는 UserStatus 1:1 모델의 필드에서 파생합니다.
export class QueryIdpAccountDto extends EntityQueryType(UserStatus, [
	"isActive",
] as const) {
	@StringFieldOptional({ description: "이름 또는 이메일 검색" })
	readonly search?: string;

	@BooleanFieldOptional({ description: "잠금 상태 필터" })
	readonly isLocked?: boolean;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 허용 필드: createdAt, name, email, lastLoginAt. 예: ?sort=name&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	readonly sort?: string[];
}
