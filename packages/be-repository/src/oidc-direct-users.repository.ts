import type { AuthAuditResult } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import type { OidcAuthUserData } from "./oidc-auth-user.data";
import { OidcDirectPrismaProvider } from "./oidc-direct-prisma.provider";

/**
 * IDP 전용 Direct User Repository
 *
 * DirectPrismaProvider를 사용하여 CLS 트랜잭션 프록시를 우회합니다.
 * IDP의 OIDC 인증 흐름에서는 tenant 컨텍스트 없이 사용자를 조회해야 하므로
 * CLS 프록시가 감싼 PRISMA_SERVICE_TOKEN 대신 별도의 PrismaClient를 사용합니다.
 */
@Injectable()
export class OidcDirectUsersRepository {
	private readonly logger = new Logger(OidcDirectUsersRepository.name);

	constructor(
		private readonly directPrismaProvider: OidcDirectPrismaProvider,
	) {}

	/**
	 * 이메일로 인증용 조회 (보안 필드 포함)
	 * 로그인 비밀번호 검증 시 사용합니다.
	 */
	async findByEmailForAuth(email: string): Promise<OidcAuthUserData | null> {
		this.logger.debug(`인증용 이메일 조회: ${email}`);

		const prisma = await this.directPrismaProvider.getClient();
		return prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
				failedLoginAttempts: true,
				lockedUntil: true,
				isPermanentlyLocked: true,
				isActive: true,
				mustChangePassword: true,
			},
		});
	}

	/**
	 * 로그인 실패 처리 (실패 횟수 증가 + 잠금 설정)
	 */
	async updateLoginFailure(
		userId: string,
		failedAttempts: number,
		lockData?: { lockedUntil?: Date; isPermanentlyLocked?: boolean },
	): Promise<void> {
		const prisma = await this.directPrismaProvider.getClient();
		await prisma.user.update({
			where: { id: userId },
			data: {
				failedLoginAttempts: failedAttempts,
				...(lockData?.lockedUntil && { lockedUntil: lockData.lockedUntil }),
				...(lockData?.isPermanentlyLocked !== undefined && {
					isPermanentlyLocked: lockData.isPermanentlyLocked,
				}),
			},
		});
	}

	/**
	 * 로그인 성공 처리 (실패 횟수 리셋 + 마지막 로그인 정보 업데이트)
	 */
	async updateLoginSuccess(userId: string, ipAddress: string): Promise<void> {
		const prisma = await this.directPrismaProvider.getClient();
		await prisma.user.update({
			where: { id: userId },
			data: {
				failedLoginAttempts: 0,
				lockedUntil: null,
				lastLoginAt: new Date(),
				lastLoginIp: ipAddress,
			},
		});
	}

	/**
	 * 잠금 자동 해제 (일시 잠금 시간 경과 후)
	 */
	async clearLock(userId: string): Promise<void> {
		const prisma = await this.directPrismaProvider.getClient();
		await prisma.user.update({
			where: { id: userId },
			data: {
				failedLoginAttempts: 0,
				lockedUntil: null,
			},
		});
	}

	/**
	 * 감사 로그 저장
	 */
	async createAuditLog(data: {
		email: string;
		userId?: string;
		result: AuthAuditResult;
		failureReason?: string;
		ipAddress: string;
		userAgent?: string;
		clientId?: string;
	}): Promise<void> {
		const prisma = await this.directPrismaProvider.getClient();
		try {
			await prisma.authAuditLog.create({
				data: {
					email: data.email,
					userId: data.userId ?? null,
					result: data.result,
					failureReason: data.failureReason ?? null,
					ipAddress: data.ipAddress,
					userAgent: data.userAgent ?? null,
					clientId: data.clientId ?? null,
				},
			});
		} catch (error) {
			this.logger.warn(
				`auth_audit_logs 저장 실패로 스킵: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	/**
	 * ID로 사용자 조회 (Tenants 포함)
	 * AccountService의 claims 빌드에 사용합니다.
	 */
	async findByIdWithTenants(id: string) {
		this.logger.debug(`ID로 사용자 조회: ${id.slice(-8)}`);

		const prisma = await this.directPrismaProvider.getClient();
		return prisma.user.findUnique({
			where: { id },
			include: {
				tenants: {
					include: {
						role: true,
						space: {
							include: {
								fitnessCenter: {
									include: {
										company: true,
									},
								},
							},
						},
					},
				},
			},
		} as never);
	}
}
