import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { TenantAccessRequestStatus } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { QueryDto } from "../query/query.dto";

export class QueryTenantAccessRequestDto extends QueryDto {
	@StringFieldOptional({
		description: "검색어 (신청자 이름/이메일, 시설명)",
	})
	search?: string;

	@EnumFieldOptional(() => TenantAccessRequestStatus, {
		description: "신청 상태 필터",
	})
	status?: TenantAccessRequestStatus;

	@UUIDFieldOptional({
		description: "Space ID 필터",
	})
	spaceId?: string;

	@UUIDFieldOptional({
		description: "신청자 ID 필터",
	})
	requesterId?: string;

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
