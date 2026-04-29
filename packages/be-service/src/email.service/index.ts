import type { SMTPConfig } from "@cocrepo/type";
import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Transporter } from "nodemailer";
import * as nodemailer from "nodemailer";
import type { RenderedTemplateResult } from "../template.service/index";
import { TemplateService } from "../template.service/index";

const PASSWORD_RESET_TEMPLATE_CODE = "AUTH_PASSWORD_RESET";
const TEMPORARY_PASSWORD_TEMPLATE_CODE = "AUTH_TEMPORARY_PASSWORD";
const EMAIL_VERIFICATION_TEMPLATE_CODE = "AUTH_EMAIL_VERIFICATION";

function normalizeOptionalBooleanString(value?: string): string | undefined {
	const normalizedValue = value?.trim();
	return normalizedValue ? normalizedValue : undefined;
}

function resolveSmtpSecure(
	smtpSecure: string | undefined,
	smtpPort: number | string | undefined,
): boolean {
	if (smtpSecure !== undefined) {
		return smtpSecure === "true";
	}

	return Number(smtpPort) === 465;
}

/**
 * 메일 발송 입력 계약
 */
export interface EmailSendInput {
	to: string;
	subject: string;
	html: string;
}

/**
 * 메일 발송 provider 추상 token
 */
export abstract class EmailProvider {
	abstract send(input: EmailSendInput): Promise<void>;
}

/**
 * SMTP 기반 메일 발송 provider
 */
@Injectable()
export class SmtpEmailProvider implements EmailProvider {
	private readonly logger = new Logger(SmtpEmailProvider.name);
	private transporter: Transporter | null = null;
	private readonly smtpConfig: SMTPConfig;

	constructor(private readonly configService: ConfigService) {
		const smtpSecure = normalizeOptionalBooleanString(process.env.SMTP_SECURE);
		const smtpConfig = this.configService.get<SMTPConfig>("smtp");
		this.smtpConfig = smtpConfig || {
			host: process.env.SMTP_HOST || "localhost",
			port: Number(process.env.SMTP_PORT) || 587,
			username: process.env.SMTP_USERNAME || "",
			password: process.env.SMTP_PASSWORD || "",
			secure: resolveSmtpSecure(smtpSecure, process.env.SMTP_PORT),
			sender: process.env.SMTP_SENDER || "noreply@example.com",
		};
	}

	/**
	 * Nodemailer 트랜스포터를 지연 생성합니다.
	 * SMTP 설정이 없는 개발 환경에서는 로그만 출력합니다.
	 */
	private getTransporter(): Transporter | null {
		if (this.transporter) return this.transporter;

		if (!this.smtpConfig.host || this.smtpConfig.host === "localhost") {
			this.logger.warn(
				"SMTP 설정이 없습니다. 이메일 발송 대신 로그를 출력합니다.",
			);
			return null;
		}

		this.transporter = nodemailer.createTransport({
			host: this.smtpConfig.host,
			port: this.smtpConfig.port,
			secure: this.smtpConfig.secure,
			auth: {
				user: this.smtpConfig.username,
				pass: this.smtpConfig.password,
			},
		});

		return this.transporter;
	}

	async send({ to, subject, html }: EmailSendInput): Promise<void> {
		const transporter = this.getTransporter();

		if (!transporter) {
			this.logger.log(
				`[개발 모드] 이메일 발송 (to: ${to}, subject: ${subject})`,
			);
			this.logger.debug(`이메일 내용:\n${html}`);
			return;
		}

		try {
			await transporter.sendMail({
				from: this.smtpConfig.sender,
				to,
				subject,
				html,
			});
			this.logger.log(`이메일 발송 성공: ${to} (${subject})`);
		} catch (error) {
			this.logger.error(`이메일 발송 실패: ${to} (${subject}) - ${error}`);
			throw error;
		}
	}
}

/**
 * 이메일 유즈케이스 서비스
 *
 * 비밀번호 재설정, 임시 비밀번호 발급 등 인증 관련 이메일을 조합합니다.
 * 실제 전송은 주입된 EmailProvider 구현체에 위임합니다.
 */
@Injectable()
export class EmailService {
	constructor(
		@Inject(EmailProvider)
		private readonly emailProvider: EmailProvider,
		private readonly templateService: TemplateService,
	) {}

	/**
	 * 비밀번호 재설정 이메일을 발송합니다.
	 *
	 * @param email - 수신자 이메일
	 * @param resetUrl - 비밀번호 재설정 페이지 URL (토큰 포함)
	 */
	async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
		const rendered = await this.templateService.renderByCode(
			PASSWORD_RESET_TEMPLATE_CODE,
			{
				resetUrl,
				expiresInMinutes: "30",
			},
		);

		await this.sendRenderedEmail(email, PASSWORD_RESET_TEMPLATE_CODE, rendered);
	}

	/**
	 * 임시 비밀번호 발급 이메일을 발송합니다.
	 *
	 * @param email - 수신자 이메일
	 * @param tempPassword - 임시 비밀번호
	 */
	async sendTemporaryPasswordEmail(
		email: string,
		tempPassword: string,
	): Promise<void> {
		const rendered = await this.templateService.renderByCode(
			TEMPORARY_PASSWORD_TEMPLATE_CODE,
			{
				temporaryPassword: tempPassword,
			},
		);

		await this.sendRenderedEmail(
			email,
			TEMPORARY_PASSWORD_TEMPLATE_CODE,
			rendered,
		);
	}

	/**
	 * 회원가입 이메일 인증 링크를 발송합니다.
	 *
	 * @param email - 수신자 이메일
	 * @param verificationUrl - 이메일 인증 API 링크
	 */
	async sendEmailVerificationEmail(
		email: string,
		verificationUrl: string,
	): Promise<void> {
		const rendered = await this.templateService.renderByCode(
			EMAIL_VERIFICATION_TEMPLATE_CODE,
			{
				verificationUrl,
				expiresInMinutes: "30",
			},
		);

		await this.sendRenderedEmail(
			email,
			EMAIL_VERIFICATION_TEMPLATE_CODE,
			rendered,
		);
	}

	/**
	 * 이메일 발송 공통 메서드
	 */
	async sendEmail(input: EmailSendInput): Promise<void> {
		await this.emailProvider.send(input);
	}

	private async sendRenderedEmail(
		to: string,
		templateCode: string,
		rendered: RenderedTemplateResult,
	): Promise<void> {
		if (rendered.type !== "EMAIL") {
			throw new BadRequestException(
				`이메일 발송 템플릿이 EMAIL 유형이 아닙니다: ${templateCode}`,
			);
		}

		if (!rendered.subject) {
			throw new BadRequestException(
				`이메일 발송 템플릿에 제목이 없습니다: ${templateCode}`,
			);
		}

		await this.sendEmail({
			to,
			subject: rendered.subject,
			html: rendered.content,
		});
	}
}
