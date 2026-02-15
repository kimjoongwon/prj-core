import { DateFieldOptional, EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { AuthAuditResult, type Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryAuthAuditLogDto extends PrismaQueryDto<Prisma.AuthAuditLogWhereInput> {
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

	/**
	 * startDate/endDate는 자동 매핑에서 제외하고 커스텀 처리합니다.
	 * (자동 매핑의 *From/*To 컨벤션과 다른 네이밍이므로)
	 */
	protected excludeFromAutoMap(): string[] {
		return ["startDate", "endDate"];
	}

	toPrismaWhere(baseWhere?: Partial<Prisma.AuthAuditLogWhereInput>): Prisma.AuthAuditLogWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		// 날짜 범위 필터: startDate/endDate -> createdAt gte/lte
		const dateRange = this.dateRangeFilter(this.startDate, this.endDate);
		if (dateRange) {
			where.createdAt = dateRange as Prisma.AuthAuditLogWhereInput["createdAt"];
		}

		return where;
	}
}
