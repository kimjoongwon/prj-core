import type { EmailSendInput } from "@cocrepo/input";
import type { SMTPConfig } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Transporter } from "nodemailer";
import * as nodemailer from "nodemailer";
import { EmailProvider } from "./email-provider";
import { normalizeOptionalBooleanString } from "./normalize-optional-boolean-string";
import { resolveSmtpSecure } from "./resolve-smtp-secure";

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
