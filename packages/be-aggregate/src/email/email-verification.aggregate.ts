import type { EmailVerificationCreateInput } from "@cocrepo/input";
import { EmailVerificationsRepository } from "@cocrepo/repository";
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
					verifiedUser: { disconnect: true },
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

		return { email: email.value, expiresAt };
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

	async markVerified(id: string, userId: string) {
		return this.repository.updateById(id, {
			status: "VERIFIED",
			verifiedAt: new Date(),
			verifiedUser: { connect: { id: userId } },
		});
	}

	private async sendAndRecord(
		verificationId: string,
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
		return { rawToken: token.value, tokenHash: token.toHash() };
	}

	private buildConfirmUrl(rawToken: string): string {
		const baseUrl =
			process.env.CORE_API_PUBLIC_URL ||
			process.env.OIDC_ISSUER ||
			"http://localhost:3000";
		return `${baseUrl.replace(/\/$/, "")}/api/v1/auth/email-verifications/${rawToken}/confirm`;
	}
}
