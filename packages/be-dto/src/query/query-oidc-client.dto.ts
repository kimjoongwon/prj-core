import {
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Transform } from "class-transformer";

import { EntityQueryType } from "./entity-query-type";
import { OidcClient } from "@cocrepo/entity";

export class QueryOidcClientDto extends EntityQueryType(OidcClient, [
	"isActive",
] as const) {
	@StringFieldOptional({ description: "Client ID 또는 이름 통합 검색" })
	readonly search?: string;


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
