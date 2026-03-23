import { HashedPassword, PlainPassword } from "@cocrepo/vo";
import { Injectable, Logger } from "@nestjs/common";
import { DirectPrismaProvider } from "../oidc/direct-prisma.provider";
import { DirectUserRepository } from "../oidc/direct-user.repository";

/** 보안 정책 캐시 */
interface SecurityPolicyCache {
	temporaryLockThreshold: number;
	permanentLockThreshold: number;
	temporaryLockDurationMs: number;
	cachedAt: number;
}

const POLICY_CACHE_TTL_MS = 5 * 60 * 1000; // 5분

/** 로그인 검증 결과 */
export interface LoginValidationResult {
	success: boolean;
	userId?: string;
	mustChangePassword?: boolean;
	error?: string;
	remainingAttempts?: number;
	lockedUntil?: Date;
	/** 일시 잠금 임계값 (DB 정책 값) */
	temporaryLockThreshold?: number;
	/** 일시 잠금 지속시간 (분, DB 정책 값) */
	temporaryLockDurationMin?: number;
}

/**
 * InteractionLoginService
 *
 * OIDC interaction 로그인 검증 책임만 담당합니다.
 * - 사용자 인증 (이메일/비밀번호)
 * - 실패 제한/잠금
 * - 감사 로그 기록
 * - 보안 정책 조회/캐시
 */
@Injectable()
export class InteractionLoginService {
	private readonly logger = new Logger(InteractionLoginService.name);
	private policyCache: SecurityPolicyCache | null = null;

	constructor(
		private readonly directUserRepository: DirectUserRepository,
		private readonly directPrismaProvider: DirectPrismaProvider,
	) {}

	/**
	 * 보안 정책을 조회합니다 (캐시 활용)
	 */
	private async getSecurityPolicy(): Promise<SecurityPolicyCache> {
		if (
			this.policyCache &&
			Date.now() - this.policyCache.cachedAt < POLICY_CACHE_TTL_MS
		) {
			return this.policyCache;
		}

		const prisma = await this.directPrismaProvider.getClient();
		const policy = await prisma.securityPolicy.findUnique({
			where: { key: "default" },
		});

		if (!policy) {
			this.logger.warn("보안 정책이 없어 기본값을 사용합니다");
			this.policyCache = {
				temporaryLockThreshold: 5,
				permanentLockThreshold: 10,
				temporaryLockDurationMs: 15 * 60 * 1000,
				cachedAt: Date.now(),
			};
			return this.policyCache;
		}

		this.policyCache = {
			temporaryLockThreshold: policy.temporaryLockThreshold,
			permanentLockThreshold: policy.permanentLockThreshold,
			temporaryLockDurationMs: policy.temporaryLockDurationMin * 60 * 1000,
			cachedAt: Date.now(),
		};

		return this.policyCache;
	}

	/**
	 * 사용자 인증 (이메일/비밀번호) + 실패 제한 + 잠금 + 감사 로그
	 */
	async validateUser(
		email: string,
		password: string,
		ipAddress: string,
		userAgent?: string,
		clientId?: string,
	): Promise<LoginValidationResult> {
		this.logger.debug(`로그인 시도: ${email}`);

		const auditBase = { email, ipAddress, userAgent, clientId };

		// 1. 사용자 조회
		const user = await this.directUserRepository.findByEmailForAuth(email);
		if (!user) {
			this.logger.debug(`사용자 미존재: ${email}`);
			await this.directUserRepository.createAuditLog({
				...auditBase,
				result: "FAILURE",
				failureReason: "USER_NOT_FOUND",
			});
			return { success: false, error: "INVALID_CREDENTIALS" };
		}

		// 2. 활성 상태 확인
		if (!user.isActive) {
			this.logger.debug(`비활성 계정: ${email}`);
			await this.directUserRepository.createAuditLog({
				...auditBase,
				userId: user.id,
				result: "FAILURE",
				failureReason: "ACCOUNT_INACTIVE",
			});
			return { success: false, error: "INVALID_CREDENTIALS" };
		}

		// 3. 영구 잠금 확인
		if (user.isPermanentlyLocked) {
			this.logger.debug(`영구 잠금 계정: ${email}`);
			await this.directUserRepository.createAuditLog({
				...auditBase,
				userId: user.id,
				result: "LOCKED",
				failureReason: "ACCOUNT_LOCKED_PERMANENT",
			});
			return { success: false, error: "ACCOUNT_LOCKED_PERMANENT" };
		}

		// 4. 일시 잠금 확인
		if (user.lockedUntil) {
			if (user.lockedUntil > new Date()) {
				this.logger.debug(`일시 잠금 중: ${email}`);
				await this.directUserRepository.createAuditLog({
					...auditBase,
					userId: user.id,
					result: "LOCKED",
					failureReason: "ACCOUNT_LOCKED_TEMPORARY",
				});
				return {
					success: false,
					error: "ACCOUNT_LOCKED_TEMPORARY",
					lockedUntil: user.lockedUntil,
				};
			}
			// 잠금 시간 경과 → 자동 해제
			await this.directUserRepository.clearLock(user.id);
		}

		// 5. 비밀번호 검증
		try {
			const plainPassword = PlainPassword.create(password);
			const hashedPassword = HashedPassword.fromHash(user.password);
			const isValid = await hashedPassword.compare(plainPassword);

			if (!isValid) {
				return this.handleLoginFailure(
					user.id,
					email,
					user.failedLoginAttempts,
					auditBase,
				);
			}
		} catch (error) {
			this.logger.debug(`비밀번호 검증 오류: ${error}`);
			return this.handleLoginFailure(
				user.id,
				email,
				user.failedLoginAttempts,
				auditBase,
			);
		}

		// 6. 로그인 성공
		this.logger.debug(`로그인 성공: ${email}`);
		await this.directUserRepository.updateLoginSuccess(user.id, ipAddress);
		await this.directUserRepository.createAuditLog({
			...auditBase,
			userId: user.id,
			result: "SUCCESS",
		});

		return {
			success: true,
			userId: user.id,
			mustChangePassword: user.mustChangePassword,
		};
	}

	/**
	 * 로그인 실패 처리 (횟수 증가 + 잠금 판단 + 감사 로그)
	 * 잠금 임계값은 SecurityPolicy DB에서 조회합니다.
	 */
	private async handleLoginFailure(
		userId: string,
		_email: string,
		currentAttempts: number,
		auditBase: {
			email: string;
			ipAddress: string;
			userAgent?: string;
			clientId?: string;
		},
	): Promise<LoginValidationResult> {
		const policy = await this.getSecurityPolicy();
		const newAttempts = currentAttempts + 1;

		const temporaryLockDurationMin = Math.round(
			policy.temporaryLockDurationMs / 60000,
		);

		// 영구 잠금 임계값 도달
		if (newAttempts >= policy.permanentLockThreshold) {
			await this.directUserRepository.updateLoginFailure(userId, newAttempts, {
				isPermanentlyLocked: true,
			});
			await this.directUserRepository.createAuditLog({
				...auditBase,
				userId,
				result: "LOCKED",
				failureReason: "ACCOUNT_LOCKED_PERMANENT",
			});
			return { success: false, error: "ACCOUNT_LOCKED_PERMANENT" };
		}

		// 일시 잠금 임계값 도달
		if (newAttempts >= policy.temporaryLockThreshold) {
			const lockedUntil = new Date(Date.now() + policy.temporaryLockDurationMs);
			await this.directUserRepository.updateLoginFailure(userId, newAttempts, {
				lockedUntil,
			});
			await this.directUserRepository.createAuditLog({
				...auditBase,
				userId,
				result: "LOCKED",
				failureReason: "ACCOUNT_LOCKED_TEMPORARY",
			});
			return {
				success: false,
				error: "ACCOUNT_LOCKED_TEMPORARY",
				lockedUntil,
				temporaryLockThreshold: policy.temporaryLockThreshold,
				temporaryLockDurationMin,
			};
		}

		// 일반 실패
		await this.directUserRepository.updateLoginFailure(userId, newAttempts);
		await this.directUserRepository.createAuditLog({
			...auditBase,
			userId,
			result: "FAILURE",
			failureReason: "INVALID_CREDENTIALS",
		});

		return {
			success: false,
			error: "INVALID_CREDENTIALS",
			remainingAttempts: policy.temporaryLockThreshold - newAttempts,
			temporaryLockThreshold: policy.temporaryLockThreshold,
			temporaryLockDurationMin,
		};
	}
}
