import { SpaceContext } from "@cocrepo/context";
import type { QueryAuthAuditLogDto } from "@cocrepo/dto";
import type { Prisma } from "@cocrepo/prisma";
import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";

/**
 * 인증 감사 로그 조회 결과
 */
export interface GetAuditLogsResult {
	logs: Awaited<
		ReturnType<AuthAuditLogsRepository["findMany"]>
	>["logs"];
	totalCount: number;
}

/**
 * 감사 로그 통계
 */
export interface AuditLogStats {
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	totalCount: number;
}

/**
 * 인증 감사 로그 서비스
 *
 * 로그인/인증 시도에 대한 감사 로그를 조회합니다.
 * 감사 로그는 Space와 무관하므로 SpaceContext를 사용하지 않습니다.
 *
 * ✅ 단일 Repository 의존
 * ❌ 다른 도메인 Repository 의존 금지
 */
@Injectable()
export class AuthAuditLogService {
	private readonly logger = new Logger(AuthAuditLogService.name);

	constructor(
		private readonly repository: AuthAuditLogsRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	/**
	 * 감사 로그 목록 조회
	 *
	 * @param query - 조회 조건 (필터, 정렬, 페이지네이션)
	 * @returns 감사 로그 배열 및 총 개수
	 */
	async getAuditLogs(query: QueryAuthAuditLogDto): Promise<GetAuditLogsResult> {
		this.logger.debug("감사 로그 목록 조회");

		const where = query.toPrismaWhere(this.createScopedWhere());
		const orderBy = query.toPrismaOrderBy();

		return this.repository.findMany({
			where,
			orderBy,
			skip: query.skip ?? 0,
			take: query.take ?? 20,
		});
	}

	/**
	 * 사용자별 최근 감사 로그 조회
	 *
	 * @param userId - 사용자 ID
	 * @param limit - 조회 개수 (기본값: 10)
	 * @returns 최근 감사 로그 배열
	 */
	async getRecentLogsByUserId(userId: string, limit = 10) {
		this.logger.debug(`사용자별 최근 감사 로그 조회: userId=${userId.slice(-8)}, limit=${limit}`);

		return this.repository.findByUserId(userId, limit);
	}

	/**
	 * 오늘 감사 로그 통계 조회
	 */
	async getStats(): Promise<AuditLogStats> {
		this.logger.debug("감사 로그 통계 조회");
		const scopedWhere = this.createScopedWhere();

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const [todaySuccessCount, todayFailureCount, todayLockedCount, totalCount] =
			await Promise.all([
				this.repository.count({
					...scopedWhere,
					result: "SUCCESS",
					createdAt: { gte: today },
				}),
				this.repository.count({
					...scopedWhere,
					result: "FAILURE",
					createdAt: { gte: today },
				}),
				this.repository.count({
					...scopedWhere,
					result: "LOCKED",
					createdAt: { gte: today },
				}),
				this.repository.count(scopedWhere),
			]);

		return {
			todaySuccessCount,
			todayFailureCount,
			todayLockedCount,
			totalCount,
		};
	}

	private createScopedWhere(): Prisma.AuthAuditLogWhereInput {
		const spaceIds = this.spaceContext.spaceIds;
		if (spaceIds === undefined) {
			return {};
		}

		return {
			user: {
				tenants: {
					some: {
						spaceId: { in: spaceIds },
						removedAt: null,
					},
				},
			},
		};
	}
}
