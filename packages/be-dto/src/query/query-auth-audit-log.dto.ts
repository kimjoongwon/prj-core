import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { AuthAuditResult } from "@cocrepo/prisma";
import { QueryDto } from "./query.dto";

export class QueryAuthAuditLogDto extends QueryDto {
	@StringFieldOptional({ description: "이메일 (부분 일치)" })
	readonly email?: string;

	@EnumFieldOptional(() => AuthAuditResult, { description: "인증 결과" })
	readonly result?: AuthAuditResult;

	@StringFieldOptional({ description: "IP 주소 (부분 일치)" })
	readonly ipAddress?: string;

	@StringFieldOptional({ description: "OIDC 클라이언트 ID (부분 일치)" })
	readonly clientId?: string;

	@DateFieldOptional({ description: "시작일 (createdAt >= startDate)" })
	readonly startDate?: Date;

	@DateFieldOptional({ description: "종료일 (createdAt <= endDate)" })
	readonly endDate?: Date;
}
