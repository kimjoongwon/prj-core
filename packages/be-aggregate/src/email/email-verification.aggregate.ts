import type {
	EmailVerificationCreateInput,
	GetEmailVerificationsQueryInput,
} from "@cocrepo/input";
import {
	buildEmailVerificationQueryOrderBy,
	buildEmailVerificationQueryWhere,
	EmailVerificationsRepository,
} from "@cocrepo/repository";
import { EmailService } from "@cocrepo/service";
import { Email, EmailVerificationToken, Phone } from "@cocrepo/vo";
import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
} from "@nestjs/common";
import { EMAIL_VERIFICATION_ERROR } from "./email-verification-error";
import { RESEND_COOLDOWN_MS } from "./resend-cooldown-ms";
import { TOKEN_TTL_MS } from "./token-ttl-ms";

@Injectable()
export class EmailVerificationAggregate {
	private readonly logger = new Logger(EmailVerificationAggregate.name);

	constructor(
		private readonly repository: EmailVerificationsRepository,
		private readonly emailService: EmailService,
	) {}

	async requestVerification(input: EmailVerificationCreateInput) {
		const email = Email.create(input.email);
		const phone = Phone.create(input.phone);
		const normalizedInput = {
			...input,
			email: email.value,
			phone: phone.normalized,
		};
		const existing = await this.repository.findLatestByEmail(email.value);

		if (existing?.status === "VERIFIED") {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.ALREADY_VERIFIED);
		}

		this.assertResendCooldown(existing);

		const tokenPair = this.createTokenPair();
		const expiresAt = this.createExpiresAt();
		const lastSentAt = new Date();

		const verification = existing
			? await this.repository.updateById(existing.id, {
					...normalizedInput,
					tokenHash: tokenPair.tokenHash,
					status: "PENDING",
					expiresAt,
					verifiedAt: null,
					verifiedUserId: null,
					lastSentAt,
					sendCount: { increment: 1 },
					lastSendStatus: null,
					lastSendError: null,
				})
			: await this.repository.create({
					...normalizedInput,
					tokenHash: tokenPair.tokenHash,
					status: "PENDING",
					expiresAt,
					lastSentAt,
					sendCount: 1,
				});

		await this.sendAndRecord(verification.id, email.value, tokenPair.rawToken);

		return {
			email: email.value,
			expiresAt,
		};
	}

	async resend(id: bigint) {
		const existing = await this.repository.findById(id);
		if (!existing || existing.removedAt) {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.INVALID_TOKEN);
		}

		if (existing.status === "VERIFIED") {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.ALREADY_VERIFIED);
		}

		this.assertResendCooldown(existing);

		const tokenPair = this.createTokenPair();
		const expiresAt = this.createExpiresAt();

		const updated = await this.repository.updateById(existing.id, {
			tokenHash: tokenPair.tokenHash,
			status: "PENDING",
			expiresAt,
			lastSentAt: new Date(),
			sendCount: { increment: 1 },
			lastSendStatus: null,
			lastSendError: null,
		});

		await this.sendAndRecord(updated.id, updated.email, tokenPair.rawToken);
		const latest = await this.repository.findById(updated.id);
		return this.toDto(latest ?? updated);
	}

	async getMany(query: GetEmailVerificationsQueryInput) {
		const where = buildEmailVerificationQueryWhere(query, { removedAt: null });
		const verificationResult = await this.repository.findMany({
			where,
			orderBy: buildEmailVerificationQueryOrderBy(query),
			skip: query.skip ?? 0,
			take: query.take ?? 20,
		});

		return {
			data: verificationResult.items.map((item) => this.toDto(item)),
			totalCount: verificationResult.totalCount,
		};
	}

	async consumePendingByRawToken(rawToken: string) {
		let tokenHash: string;
		try {
			tokenHash = EmailVerificationToken.create(rawToken).toHash();
		} catch {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.INVALID_TOKEN);
		}
		const verification = await this.repository.findByTokenHash(tokenHash);
		if (!verification || verification.removedAt) {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.INVALID_TOKEN);
		}

		if (verification.status === "VERIFIED") {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.ALREADY_VERIFIED);
		}

		if (verification.expiresAt.getTime() <= Date.now()) {
			await this.repository.updateById(verification.id, { status: "EXPIRED" });
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.EXPIRED);
		}

		return verification;
	}

	async markVerified(id: bigint, userId: bigint) {
		return this.repository.updateById(id, {
			status: "VERIFIED",
			verifiedAt: new Date(),
			verifiedUserId: userId,
		});
	}

	toDto(verification: {
		id: bigint;
		createdAt: Date;
		updatedAt: Date | null;
		email: string;
		name: string;
		status: "PENDING" | "VERIFIED" | "EXPIRED";
		expiresAt: Date;
		verifiedAt: Date | null;
		lastSentAt: Date | null;
		sendCount: number;
		lastSendStatus: string | null;
		verifiedUserId: bigint | null;
	}) {
		const resendAvailableAt = this.getResendAvailableAt(
			verification.lastSentAt,
		);

		return {
			id: verification.id,
			createdAt: verification.createdAt,
			updatedAt: verification.updatedAt,
			email: verification.email,
			name: verification.name,
			status: verification.status,
			expiresAt: verification.expiresAt,
			verifiedAt: verification.verifiedAt,
			lastSentAt: verification.lastSentAt,
			sendCount: verification.sendCount,
			lastSendStatus: verification.lastSendStatus,
			verifiedUserId: verification.verifiedUserId,
			canResend:
				verification.status !== "VERIFIED" &&
				(!resendAvailableAt || resendAvailableAt.getTime() <= Date.now()),
			resendAvailableAt,
		};
	}

	private async sendAndRecord(
		verificationId: bigint,
		email: string,
		rawToken: string,
	): Promise<void> {
		try {
			await this.emailService.sendEmailVerificationEmail(
				email,
				this.buildConfirmUrl(rawToken),
			);
			await this.repository.updateById(verificationId, {
				lastSendStatus: "SUCCESS",
				lastSendError: null,
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.logger.error(`이메일 인증 발송 실패: ${email} - ${message}`);
			await this.repository.updateById(verificationId, {
				lastSendStatus: "FAILURE",
				lastSendError: message,
			});
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.SEND_FAILED);
		}
	}

	private assertResendCooldown(
		verification: { lastSentAt: Date | null } | null,
	): void {
		const resendAvailableAt = this.getResendAvailableAt(
			verification?.lastSentAt ?? null,
		);
		if (resendAvailableAt && resendAvailableAt.getTime() > Date.now()) {
			throw new HttpException(
				EMAIL_VERIFICATION_ERROR.RESEND_COOLDOWN,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}
	}

	private getResendAvailableAt(lastSentAt: Date | null): Date | null {
		if (!lastSentAt) {
			return null;
		}

		return new Date(lastSentAt.getTime() + RESEND_COOLDOWN_MS);
	}

	private createExpiresAt(): Date {
		return new Date(Date.now() + TOKEN_TTL_MS);
	}

	private createTokenPair(): { rawToken: string; tokenHash: string } {
		const token = EmailVerificationToken.generate();
		return {
			rawToken: token.value,
			tokenHash: token.toHash(),
		};
	}

	private buildConfirmUrl(rawToken: string): string {
		const baseUrl =
			process.env.CORE_API_PUBLIC_URL ||
			process.env.OIDC_ISSUER ||
			"http://localhost:3000";
		return `${baseUrl.replace(/\/$/, "")}/api/v1/auth/email-verifications/${rawToken}/confirm`;
	}
}
