import { StringFieldOptional } from "@cocrepo/decorator/field";
import { OidcModel } from "@cocrepo/entity";
import { Transform } from "class-transformer";
import { EntityQueryType } from "./entity-query-type";

export class QueryOidcSessionDto extends EntityQueryType(OidcModel, [
	"modelType",
] as const) {
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
