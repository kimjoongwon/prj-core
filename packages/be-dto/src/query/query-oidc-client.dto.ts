import {
	BooleanFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Transform } from "class-transformer";

import { QueryDto } from "./query.dto";

export class QueryOidcClientDto extends QueryDto {
	@StringFieldOptional({ description: "Client ID 또는 이름 통합 검색" })
	readonly search?: string;

	@BooleanFieldOptional({ description: "활성 상태 필터" })
	readonly isActive?: boolean;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 허용 필드: createdAt, clientId, name. 예: ?sort=clientId&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	readonly sort?: string[];
}
