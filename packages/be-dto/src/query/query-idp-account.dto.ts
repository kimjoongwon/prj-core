import {
	BooleanFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Transform } from "class-transformer";
import { QueryDto } from "./query.dto";

export class QueryIdpAccountDto extends QueryDto {
	@StringFieldOptional({ description: "이름 또는 이메일 검색" })
	readonly search?: string;

	@BooleanFieldOptional({ description: "활성 상태 필터" })
	readonly isActive?: boolean;

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
