import { StringFieldOptional } from "@cocrepo/decorator";

import { QueryDto } from "./query.dto";

export class QueryOidcSessionDto extends QueryDto {
	@StringFieldOptional({
		description: "모델 타입 필터 (AccessToken, RefreshToken, Session 등)",
	})
	readonly modelType?: string;

	@StringFieldOptional({ description: "계정 ID (accountId) 검색" })
	readonly accountId?: string;
}
