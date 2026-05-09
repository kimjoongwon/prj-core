import * as crypto from "node:crypto";
import type {
	EmailVerificationDto,
	QueryEmailVerificationDto,
} from "@cocrepo/dto";
import { EmailVerificationsRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
} from "@nestjs/common";
import { EmailService } from "./email.service";

const TOKEN_TTL_MS = 30 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const EMAIL_VERIFICATION_ERROR = {
	ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
	INVALID_TOKEN: "EMAIL_VERIFICATION_INVALID",
	EXPIRED: "EMAIL_VERIFICATION_EXPIRED",
	ALREADY_VERIFIED: "EMAIL_VERIFICATION_ALREADY_VERIFIED",
	RESEND_COOLDOWN: "EMAIL_VERIFICATION_RESEND_COOLDOWN",
	SEND_FAILED: "EMAIL_VERIFICATION_SEND_FAILED",
} as const;

export interface EmailVerificationCreateInput {
	email: string;
	name: string;
	nickname: string;
	phone: string;
	address: string;
	spaceId: string;
	passwordHash: string;
}

export interface EmailVerificationRequestResult {
	email: string;
	expiresAt: Date;
}

@Injectable()
export class EmailVerificationService {
	private readonly logger = new Logger(EmailVerificationService.name);

	constructor(
		private readonly repository: EmailVerificationsRepository,
		private readonly emailService: EmailService,
	) {}

	async requestVerification(
		input: EmailVerificationCreateInput,
	): Promise<EmailVerificationRequestResult> {
		const existing = await this.repository.findLatestByEmail(input.email);

		if (existing?.status === "VERIFIED") {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.ALREADY_VERIFIED);
		}

		this.assertResendCooldown(existing);

		const { rawToken, tokenHash } = this.createTokenPair();
		const expiresAt = this.createExpiresAt();
		const lastSentAt = new Date();

		const verification = existing
			? await this.repository.updateById(existing.id, {
					...input,
					tokenHash,
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
					...input,
					tokenHash,
					status: "PENDING",
					expiresAt,
					lastSentAt,
					sendCount: 1,
				});

		await this.sendAndRecord(verification.id, input.email, rawToken);

		return {
			email: input.email,
			expiresAt,
		};
	}

	async resend(id: string): Promise<EmailVerificationDto> {
		const existing = await this.repository.findById(id);
		if (!existing || existing.removedAt) {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.INVALID_TOKEN);
		}

		if (existing.status === "VERIFIED") {
			throw new BadRequestException(EMAIL_VERIFICATION_ERROR.ALREADY_VERIFIED);
		}

		this.assertResendCooldown(existing);

		const { rawToken, tokenHash } = this.createTokenPair();
		const expiresAt = this.createExpiresAt();

		const updated = await this.repository.updateById(existing.id, {
			tokenHash,
			status: "PENDING",
			expiresAt,
			lastSentAt: new Date(),
			sendCount: { increment: 1 },
			lastSendStatus: null,
			lastSendError: null,
		});

		await this.sendAndRecord(updated.id, updated.email, rawToken);
		const latest = await this.repository.findById(updated.id);
		return this.toDto(latest ?? updated);
	}

	async getMany(query: QueryEmailVerificationDto): Promise<{
		data: EmailVerificationDto[];
		totalCount: number;
	}> {
		const where = query.toPrismaWhere({ removedAt: null });
		const { items, totalCount } = await this.repository.findMany({
			where,
			orderBy: query.toPrismaOrderBy(),
			skip: query.skip ?? 0,
			take: query.take ?? 20,
		});

		return {
			data: items.map((item) => this.toDto(item)),
			totalCount,
		};
	}

	async consumePendingByRawToken(rawToken: string) {
		const tokenHash = this.hashToken(rawToken);
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
			verifiedUserId: userId,
		});
	}

	toDto(verification: {
		id: string;
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
		verifiedUserId: string | null;
	}): EmailVerificationDto {
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
		const rawToken = crypto.randomBytes(32).toString("hex");
		return {
			rawToken,
			tokenHash: this.hashToken(rawToken),
		};
	}

	private hashToken(rawToken: string): string {
		return crypto.createHash("sha256").update(rawToken).digest("hex");
	}

	private buildConfirmUrl(rawToken: string): string {
		const baseUrl =
			process.env.IDP_API_PUBLIC_URL ||
			process.env.OIDC_ISSUER ||
			`http://localhost:${process.env.APP_PORT || 3007}`;
		return `${baseUrl.replace(/\/$/, "")}/api/v1/auth/email-verifications/${rawToken}/confirm`;
	}
}
