import {
	DateFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { EntityQueryType } from "./entity-query-type";
import { AuthAuditLog } from "@cocrepo/entity";

export class QueryAuthAuditLogDto extends EntityQueryType(AuthAuditLog, [
	"result",
] as const) {
	@StringFieldOptional({ description: "이메일 (부분 일치)" })
	readonly email?: string;


	@StringFieldOptional({ description: "IP 주소 (부분 일치)" })
	readonly ipAddress?: string;

	@StringFieldOptional({ description: "OIDC 클라이언트 ID (부분 일치)" })
	readonly clientId?: string;

	@DateFieldOptional({ description: "시작일 (createdAt >= startDate)" })
	readonly startDate?: Date;

	@DateFieldOptional({ description: "종료일 (createdAt <= endDate)" })
	readonly endDate?: Date;
}
