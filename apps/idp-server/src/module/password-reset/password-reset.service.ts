import * as crypto from "node:crypto";
import { validatePasswordPolicy } from "@cocrepo/be-common";
import { EmailService, RedisService } from "@cocrepo/service";
import { HashedPassword, PlainPassword } from "@cocrepo/vo";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DirectPrismaProvider } from "../oidc/direct-prisma.provider";
import { DirectUserRepository } from "../oidc/direct-user.repository";

/** Redis 키 접두사 */
const RESET_TOKEN_PREFIX = "password-reset:";
/** 토큰 유효 시간 (30분) */
const TOKEN_TTL_SECONDS = 30 * 60;
/** 비밀번호 히스토리 최대 보관 수 */
const MAX_PASSWORD_HISTORY = 5;

/** 토큰 검증 결과 */
export interface TokenValidationResult {
	valid: boolean;
	email?: string;
	reason?: string;
}

/**
 * 비밀번호 재설정 서비스
 *
 * - 재설정 요청: 토큰 생성 → Redis 저장 → 이메일 발송
 * - 토큰 검증: Redis에서 토큰 유효성 확인
 * - 재설정 실행: 비밀번호 정책 검증 → 재사용 확인 → 변경 → 세션 무효화
 */
@Injectable()
export class PasswordResetService {
	private readonly logger = new Logger(PasswordResetService.name);
	private readonly idpClientUrl: string;

	constructor(
		private readonly directUserRepository: DirectUserRepository,
		private readonly directPrismaProvider: DirectPrismaProvider,
		private readonly emailService: EmailService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
	) {
		this.idpClientUrl =
			this.configService.get<string>("IDP_CLIENT_URL") ||
			"http://localhost:3008";
	}

	/**
	 * 비밀번호 재설정 요청 처리
	 *
	 * 보안: 이메일 존재 여부와 관계없이 항상 성공 응답을 반환합니다.
	 */
	async requestReset(email: string): Promise<void> {
		this.logger.debug(`비밀번호 재설정 요청: ${email}`);

		// 사용자 조회 (없으면 조용히 종료)
		const user = await this.directUserRepository.findByEmailForAuth(email);
		if (!user || !user.isActive) {
			this.logger.debug(
				`재설정 요청 무시 (사용자 미존재 또는 비활성): ${email}`,
			);
			return;
		}

		// 토큰 생성
		const rawToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = crypto
			.createHash("sha256")
			.update(rawToken)
			.digest("hex");

		// Redis 저장
		await this.saveResetToken(hashedToken, {
			userId: user.id,
			email: user.email,
		});

		// 이메일 발송
		const resetUrl = `${this.idpClientUrl}/reset-password/${rawToken}`;
		try {
			await this.emailService.sendPasswordResetEmail(email, resetUrl);
			this.logger.log(`비밀번호 재설정 이메일 발송: ${email}`);
		} catch (error) {
			this.logger.error(`이메일 발송 실패: ${email} - ${error}`);
			// 이메일 발송 실패해도 사용자에게는 성공으로 응답 (보안)
		}
	}

	/**
	 * 재설정 토큰 검증
	 */
	async validateToken(rawToken: string): Promise<TokenValidationResult> {
		const hashedToken = crypto
			.createHash("sha256")
			.update(rawToken)
			.digest("hex");

		const data = await this.getResetToken(hashedToken);
		if (!data) {
			return { valid: false, reason: "TOKEN_EXPIRED" };
		}

		return { valid: true, email: data.email };
	}

	/**
	 * 비밀번호 재설정 실행
	 */
	async executeReset(rawToken: string, newPassword: string): Promise<void> {
		// 1. 토큰 검증
		const hashedToken = crypto
			.createHash("sha256")
			.update(rawToken)
			.digest("hex");

		const tokenData = await this.getResetToken(hashedToken);
		if (!tokenData) {
			throw new BadRequestException("TOKEN_EXPIRED");
		}

		// 2. 비밀번호 정책 검증
		const policyResult = validatePasswordPolicy(newPassword);
		if (!policyResult.isValid) {
			const failedRules = policyResult.rules
				.filter((r) => !r.passed)
				.map((r) => r.label);
			throw new BadRequestException(
				`PASSWORD_POLICY_VIOLATION: ${failedRules.join(", ")}`,
			);
		}

		const prisma = await this.directPrismaProvider.getClient();

		// 3. 이전 비밀번호 재사용 확인
		const recentPasswords = await prisma.passwordHistory.findMany({
			where: { userId: tokenData.userId },
			orderBy: { createdAt: "desc" },
			take: MAX_PASSWORD_HISTORY,
			select: { passwordHash: true },
		});

		const plainPassword = PlainPassword.create(newPassword);

		for (const history of recentPasswords) {
			const oldHash = HashedPassword.fromHash(history.passwordHash);
			const isReused = await oldHash.compare(plainPassword);
			if (isReused) {
				throw new BadRequestException("PASSWORD_REUSE");
			}
		}

		// 현재 비밀번호도 재사용 확인
		const currentUser = await this.directUserRepository.findByEmailForAuth(
			tokenData.email,
		);
		if (currentUser) {
			const currentHash = HashedPassword.fromHash(currentUser.password);
			const isCurrentReused = await currentHash.compare(plainPassword);
			if (isCurrentReused) {
				throw new BadRequestException("PASSWORD_REUSE");
			}
		}

		// 4. 비밀번호 변경
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);
		await prisma.user.update({
			where: { id: tokenData.userId },
			data: {
				password: hashedPassword.value,
				passwordChangedAt: new Date(),
				failedLoginAttempts: 0,
				lockedUntil: null,
				isPermanentlyLocked: false,
				mustChangePassword: false,
			},
		});

		// 5. 비밀번호 히스토리 저장
		await prisma.passwordHistory.create({
			data: {
				userId: tokenData.userId,
				passwordHash: hashedPassword.value,
			},
		});

		// 오래된 히스토리 정리 (MAX_PASSWORD_HISTORY 초과분 삭제)
		const allHistory = await prisma.passwordHistory.findMany({
			where: { userId: tokenData.userId },
			orderBy: { createdAt: "desc" },
			select: { id: true },
		});
		if (allHistory.length > MAX_PASSWORD_HISTORY) {
			const toDelete = allHistory
				.slice(MAX_PASSWORD_HISTORY)
				.map((h) => h.id);
			await prisma.passwordHistory.deleteMany({
				where: { id: { in: toDelete } },
			});
		}

		// 6. 토큰 삭제 (일회용)
		await this.deleteResetToken(hashedToken);

		this.logger.log(`비밀번호 재설정 완료: ${tokenData.email}`);
	}

	// ──── Redis 토큰 관리 ────

	private async saveResetToken(
		hashedToken: string,
		data: { userId: string; email: string },
	): Promise<void> {
		const key = `${RESET_TOKEN_PREFIX}${hashedToken}`;
		await this.redisService.set(key, JSON.stringify(data), TOKEN_TTL_SECONDS);
	}

	private async getResetToken(
		hashedToken: string,
	): Promise<{ userId: string; email: string } | null> {
		const key = `${RESET_TOKEN_PREFIX}${hashedToken}`;
		const data = await this.redisService.get(key);
		if (!data) return null;
		try {
			return JSON.parse(data);
		} catch {
			return null;
		}
	}

	private async deleteResetToken(hashedToken: string): Promise<void> {
		const key = `${RESET_TOKEN_PREFIX}${hashedToken}`;
		await this.redisService.del(key);
	}
}
