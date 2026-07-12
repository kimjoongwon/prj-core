import { SpaceContext } from "@cocrepo/context";
import type { GetAuditLogsInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";

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
export class AuthAuditLogAggregate {
	private readonly logger = new Logger(AuthAuditLogAggregate.name);

	constructor(
		private readonly repository: AuthAuditLogsRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	/**
	 * 감사 로그 목록 조회
	 *
	 * @param input - 조회 조건 (필터, 정렬, 페이지네이션)
	 * @returns 감사 로그 배열 및 총 개수
	 */
	async getAuditLogs(input: GetAuditLogsInput) {
		this.logger.debug("감사 로그 목록 조회");

		return this.repository.findMany({
			where: this.toWhere(input),
			orderBy: this.toOrderBy(input.sort),
			skip: input.skip ?? 0,
			take: input.take ?? 20,
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
		this.logger.debug(
			`사용자별 최근 감사 로그 조회: userId=${userId.slice(-8)}, limit=${limit}`,
		);

		return this.repository.findByUserId(userId, limit);
	}

	/**
	 * 오늘 감사 로그 통계 조회
	 */
	async getStats() {
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

	private toWhere(input: GetAuditLogsInput): Prisma.AuthAuditLogWhereInput {
		const where = this.createScopedWhere();

		if (input.email) {
			where.email = { contains: input.email, mode: "insensitive" };
		}
		if (input.result) {
			where.result = input.result;
		}
		if (input.ipAddress) {
			where.ipAddress = { contains: input.ipAddress, mode: "insensitive" };
		}
		if (input.clientId) {
			where.clientId = { contains: input.clientId, mode: "insensitive" };
		}
		if (input.startDate || input.endDate) {
			where.createdAt = {
				...(input.startDate ? { gte: input.startDate } : {}),
				...(input.endDate ? { lte: input.endDate } : {}),
			};
		}

		return where;
	}

	private toOrderBy(sort?: string[]): Record<string, "asc" | "desc">[] {
		if (Array.isArray(sort) && sort.length > 0) {
			return sort.map((entry) => {
				if (entry.startsWith("-")) {
					return { [entry.slice(1)]: "desc" };
				}
				return { [entry]: "asc" };
			});
		}

		return [{ createdAt: "desc" }];
	}
}
