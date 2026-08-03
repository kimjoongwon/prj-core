import { StringFieldOptional } from "@cocrepo/decorator/field";
import { Transform } from "class-transformer";

import { QueryDto } from "./query.dto";

export class QueryOidcSessionDto extends QueryDto {
	@StringFieldOptional({
		description: "모델 타입 필터 (AccessToken, RefreshToken, Session 등)",
	})
	readonly modelType?: string;

	@StringFieldOptional({ description: "계정 ID (accountId) 검색" })
	readonly accountId?: string;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 허용 필드: createdAt, updatedAt, modelType, accountId. 예: ?sort=modelType&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	readonly sort?: string[];
}
