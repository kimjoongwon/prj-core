import {
	DateFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { TenantAccessRequest } from "@cocrepo/entity";
import { Transform } from "class-transformer";
import { EntityQueryType } from "../query/entity-query-type";

export class QueryTenantAccessRequestDto extends EntityQueryType(
	TenantAccessRequest,
	["status", "spaceId", "requesterId"] as const,
) {
	@StringFieldOptional({
		description: "검색어 (신청자 이름/이메일, 시설명)",
	})
	search?: string;

	@DateFieldOptional({
		description: "신청일 시작 (ISO8601)",
	})
	createdFrom?: Date;

	@DateFieldOptional({
		description: "신청일 종료 (ISO8601)",
	})
	createdTo?: Date;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 예: ?sort=-createdAt&sort=status",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];
}
