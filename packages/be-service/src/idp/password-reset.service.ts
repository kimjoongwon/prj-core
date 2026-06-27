import {
	DEFAULT_PASSWORD_MAX_LENGTH,
	DEFAULT_PASSWORD_MIN_LENGTH,
	DEFAULT_PASSWORD_REQUIRE_LOWERCASE,
	DEFAULT_PASSWORD_REQUIRE_NUMBER,
	DEFAULT_PASSWORD_REQUIRE_SPECIAL,
	DEFAULT_PASSWORD_REQUIRE_UPPERCASE,
	DEFAULT_PASSWORD_REUSE_LIMIT,
	isCommonPassword,
} from "@cocrepo/constant";
import {
	OidcDirectPrismaProvider,
	OidcDirectUsersRepository,
} from "@cocrepo/repository";
import {
	Email,
	HashedPassword,
	PasswordResetToken,
	PlainPassword,
} from "@cocrepo/vo";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../email/email.service";
import { RedisService } from "../redis/redis.service";
import {
	RESET_TOKEN_PREFIX,
	TOKEN_TTL_SECONDS,
} from "./password-reset.constants";
import type { TokenValidationResult } from "./token-validation-result";

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
	private readonly authInteractionBaseUrl: string;

	constructor(
		private readonly directUserRepository: OidcDirectUsersRepository,
		private readonly directPrismaProvider: OidcDirectPrismaProvider,
		private readonly emailService: EmailService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
	) {
		this.authInteractionBaseUrl =
			this.configService.get<string>("OIDC_INTERACTION_BASE_URL") ||
			"http://localhost:3000/admin";
	}

	/**
	 * 비밀번호 정책을 조회합니다 (DB 기반)
	 */
	async getPasswordPolicy(): Promise<{
		minLength: number;
		maxLength: number;
		requireUppercase: boolean;
		requireLowercase: boolean;
		requireNumber: boolean;
		requireSpecial: boolean;
		blockCommonPasswords: boolean;
		reuseLimit: number;
	}> {
		const prisma = await this.directPrismaProvider.getClient();
		const policy = await prisma.securityPolicy.findUnique({
			where: { key: "default" },
		});

		return {
			minLength: policy?.passwordMinLength ?? DEFAULT_PASSWORD_MIN_LENGTH,
			maxLength: DEFAULT_PASSWORD_MAX_LENGTH,
			requireUppercase:
				policy?.passwordRequireUppercase ?? DEFAULT_PASSWORD_REQUIRE_UPPERCASE,
			requireLowercase:
				policy?.passwordRequireLowercase ?? DEFAULT_PASSWORD_REQUIRE_LOWERCASE,
			requireNumber:
				policy?.passwordRequireNumber ?? DEFAULT_PASSWORD_REQUIRE_NUMBER,
			requireSpecial:
				policy?.passwordRequireSpecial ?? DEFAULT_PASSWORD_REQUIRE_SPECIAL,
			blockCommonPasswords: true,
			reuseLimit: policy?.passwordReuseLimit ?? DEFAULT_PASSWORD_REUSE_LIMIT,
		};
	}

	/**
	 * 비밀번호 재설정 요청 처리
	 *
	 * 보안: 이메일 존재 여부와 관계없이 항상 성공 응답을 반환합니다.
	 */
	async requestReset(email: string): Promise<void> {
		this.logger.debug(`비밀번호 재설정 요청: ${email}`);

		let normalizedEmail: string;
		try {
			normalizedEmail = Email.create(email).value;
		} catch {
			this.logger.debug("재설정 요청 무시 (이메일 형식 오류)");
			return;
		}

		// 사용자 조회 (없으면 조용히 종료)
		const user =
			await this.directUserRepository.findByEmailForAuth(normalizedEmail);
		if (!user || !user.isActive) {
			this.logger.debug(
				`재설정 요청 무시 (사용자 미존재 또는 비활성): ${normalizedEmail}`,
			);
			return;
		}

		// 토큰 생성
		const resetToken = PasswordResetToken.generate();
		const hashedToken = resetToken.toHash();

		// Redis 저장
		await this.saveResetToken(hashedToken, {
			userId: user.id,
			email: user.email,
		});

		// 이메일 발송
		const resetUrl = `${this.authInteractionBaseUrl}/auth/reset-password/${resetToken.value}`;
		try {
			await this.emailService.sendPasswordResetEmail(normalizedEmail, resetUrl);
			this.logger.log(`비밀번호 재설정 이메일 발송: ${normalizedEmail}`);
		} catch (error) {
			this.logger.error(`이메일 발송 실패: ${normalizedEmail} - ${error}`);
			// 이메일 발송 실패해도 사용자에게는 성공으로 응답 (보안)
		}
	}

	/**
	 * 재설정 토큰 검증
	 */
	async validateToken(rawToken: string): Promise<TokenValidationResult> {
		let hashedToken: string;
		try {
			hashedToken = PasswordResetToken.create(rawToken).toHash();
		} catch {
			return { valid: false, reason: "TOKEN_EXPIRED" };
		}

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
		let hashedToken: string;
		try {
			hashedToken = PasswordResetToken.create(rawToken).toHash();
		} catch {
			throw new BadRequestException("TOKEN_EXPIRED");
		}

		const tokenData = await this.getResetToken(hashedToken);
		if (!tokenData) {
			throw new BadRequestException("TOKEN_EXPIRED");
		}

		// 2. 비밀번호 정책 검증 (DB 기반)
		const passwordPolicy = await this.getPasswordPolicy();
		const policyErrors: string[] = [];

		if (newPassword.length < passwordPolicy.minLength) {
			policyErrors.push(`${passwordPolicy.minLength}자 이상`);
		}
		if (newPassword.length > passwordPolicy.maxLength) {
			policyErrors.push(`${passwordPolicy.maxLength}자 이하`);
		}
		if (passwordPolicy.requireUppercase && !/[A-Z]/.test(newPassword)) {
			policyErrors.push("영문 대문자 포함");
		}
		if (passwordPolicy.requireLowercase && !/[a-z]/.test(newPassword)) {
			policyErrors.push("영문 소문자 포함");
		}
		if (passwordPolicy.requireNumber && !/[0-9]/.test(newPassword)) {
			policyErrors.push("숫자 포함");
		}
		if (
			passwordPolicy.requireSpecial &&
			!/[!@#$%^&*()_+\-=[\]{}|;:,.<>?/~`"']/.test(newPassword)
		) {
			policyErrors.push("특수문자 포함");
		}
		if (passwordPolicy.blockCommonPasswords && isCommonPassword(newPassword)) {
			policyErrors.push("흔한 비밀번호 사용 금지");
		}

		if (policyErrors.length > 0) {
			throw new BadRequestException(
				`PASSWORD_POLICY_VIOLATION: ${policyErrors.join(", ")}`,
			);
		}

		const prisma = await this.directPrismaProvider.getClient();

		// 3. 이전 비밀번호 재사용 확인
		const recentPasswords =
			passwordPolicy.reuseLimit > 0
				? await prisma.passwordHistory.findMany({
						where: { userId: tokenData.userId },
						orderBy: { createdAt: "desc" },
						take: passwordPolicy.reuseLimit,
						select: { passwordHash: true },
					})
				: [];

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

		// 오래된 히스토리 정리 (현재 포함 최근 reuseLimit개만 유지)
		const allHistory = await prisma.passwordHistory.findMany({
			where: { userId: tokenData.userId },
			orderBy: { createdAt: "desc" },
			select: { id: true },
		});
		if (
			passwordPolicy.reuseLimit > 0 &&
			allHistory.length > passwordPolicy.reuseLimit
		) {
			const toDelete = allHistory
				.slice(passwordPolicy.reuseLimit)
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
