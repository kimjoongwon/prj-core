import {
	AuthAuditLogsRepository,
	OidcClientsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { RedisService } from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";
import { INDEX_SEGMENTS } from "./index-segments";
import { OIDC_KEY_PREFIX } from "./oidc-key-prefix";

@Injectable()
export class IdpDashboardAggregate {
	private readonly logger = new Logger(IdpDashboardAggregate.name);

	constructor(
		private readonly authAuditLogsRepository: AuthAuditLogsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly oidcClientsRepository: OidcClientsRepository,
		private readonly redisService: RedisService,
	) {}

	async getStats() {
		this.logger.debug("대시보드 통계 조회");

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const [
			todaySuccessCount,
			todayFailureCount,
			todayLockedCount,
			lockedAccountCount,
			activeClientCount,
		] = await Promise.all([
			this.authAuditLogsRepository.count({
				result: "SUCCESS",
				createdAt: { gte: today },
			}),
			this.authAuditLogsRepository.count({
				result: "FAILURE",
				createdAt: { gte: today },
			}),
			this.authAuditLogsRepository.count({
				result: "LOCKED",
				createdAt: { gte: today },
			}),
			this.usersRepository.count({
				isPermanentlyLocked: true,
				removedAt: null,
			}),
			this.oidcClientsRepository.count({
				isActive: true,
				removedAt: null,
			}),
		]);

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

	async getLoginTrend(days = 7) {
		this.logger.debug(`로그인 추이 조회: 최근 ${days}일`);

		const result = [];
		const now = new Date();

		for (let i = days - 1; i >= 0; i--) {
			const dayStart = new Date(now);
			dayStart.setDate(now.getDate() - i);
			dayStart.setHours(0, 0, 0, 0);

			const dayEnd = new Date(dayStart);
			dayEnd.setDate(dayStart.getDate() + 1);

			const [successCount, failureCount] = await Promise.all([
				this.authAuditLogsRepository.count({
					result: "SUCCESS",
					createdAt: { gte: dayStart, lt: dayEnd },
				}),
				this.authAuditLogsRepository.count({
					result: { in: ["FAILURE", "LOCKED"] },
					createdAt: { gte: dayStart, lt: dayEnd },
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
