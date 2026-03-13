import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../redis.service";

// Redis OIDC 모델 키 프리픽스
const OIDC_KEY_PREFIX = "oidc";
const OIDC_MODEL_TYPES = [
	"Session",
	"AccessToken",
	"RefreshToken",
	"AuthorizationCode",
	"Grant",
	"ClientCredentials",
	"DeviceCode",
	"Interaction",
];
const INDEX_SEGMENTS = [":uid:", ":userCode:", ":grant:"];

// Prisma 타입 import (raw query용)
import type { PrismaClient } from "@cocrepo/prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

export interface DashboardStats {
	activeSessionCount: number;
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	lockedAccountCount: number;
	activeClientCount: number;
}

export interface LoginTrendItem {
	date: string;
	successCount: number;
	failureCount: number;
}

@Injectable()
export class IdpDashboardService {
	private readonly logger = new Logger(IdpDashboardService.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
		private readonly redisService: RedisService,
	) {}

	async getStats(): Promise<DashboardStats> {
		this.logger.debug("대시보드 통계 조회");

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// 오늘 감사 로그 건수 조회
		const [
			todaySuccessCount,
			todayFailureCount,
			todayLockedCount,
			lockedAccountCount,
			activeClientCount,
		] = await Promise.all([
			this.txHost.tx.authAuditLog.count({
				where: { result: "SUCCESS", createdAt: { gte: today } },
			}),
			this.txHost.tx.authAuditLog.count({
				where: { result: "FAILURE", createdAt: { gte: today } },
			}),
			this.txHost.tx.authAuditLog.count({
				where: { result: "LOCKED", createdAt: { gte: today } },
			}),
			this.txHost.tx.user.count({
				where: { isPermanentlyLocked: true, removedAt: null },
			}),
			this.txHost.tx.oidcClient.count({
				where: { isActive: true, removedAt: null },
			}),
		]);

		// Redis에서 활성 OIDC 세션 수 조회
		let activeSessionCount = 0;
		for (const modelType of ["Session", "AccessToken"]) {
			const pattern = `${OIDC_KEY_PREFIX}:${modelType}:*`;
			const keys = await this.redisService.keys(pattern);
			const dataKeys = keys.filter(
				(k) => !INDEX_SEGMENTS.some((seg) => k.includes(seg)),
			);
			activeSessionCount += dataKeys.length;
		}

		return {
			activeSessionCount,
			todaySuccessCount,
			todayFailureCount,
			todayLockedCount,
			lockedAccountCount,
			activeClientCount,
		};
	}

	async getLoginTrend(days = 7): Promise<LoginTrendItem[]> {
		this.logger.debug(`로그인 추이 조회: 최근 ${days}일`);

		const result: LoginTrendItem[] = [];
		const now = new Date();

		for (let i = days - 1; i >= 0; i--) {
			const dayStart = new Date(now);
			dayStart.setDate(now.getDate() - i);
			dayStart.setHours(0, 0, 0, 0);

			const dayEnd = new Date(dayStart);
			dayEnd.setDate(dayStart.getDate() + 1);

			const [successCount, failureCount] = await Promise.all([
				this.txHost.tx.authAuditLog.count({
					where: {
						result: "SUCCESS",
						createdAt: { gte: dayStart, lt: dayEnd },
					},
				}),
				this.txHost.tx.authAuditLog.count({
					where: {
						result: { in: ["FAILURE", "LOCKED"] },
						createdAt: { gte: dayStart, lt: dayEnd },
					},
				}),
			]);

			result.push({
				date: dayStart.toISOString().split("T")[0],
				successCount,
				failureCount,
			});
		}

		return result;
	}
}
