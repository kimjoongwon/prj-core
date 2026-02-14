import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

interface SmtpConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	sender: string;
}

/**
 * SMTP 이메일 발송 서비스
 *
 * 비밀번호 재설정, 임시 비밀번호 발급 등 인증 관련 이메일을 발송합니다.
 * ConfigService에서 smtp 설정을 읽어 Nodemailer 트랜스포터를 생성합니다.
 */
@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);
	private transporter: Transporter | null = null;
	private readonly smtpConfig: SmtpConfig;

	constructor(private readonly configService: ConfigService) {
		this.smtpConfig = this.configService.get<SmtpConfig>("smtp") || {
			host: process.env.SMTP_HOST || "localhost",
			port: Number(process.env.SMTP_PORT) || 587,
			username: process.env.SMTP_USERNAME || "",
			password: process.env.SMTP_PASSWORD || "",
			sender:
				process.env.SMTP_SENDER || "noreply@example.com",
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
			secure: this.smtpConfig.port === 465,
			auth: {
				user: this.smtpConfig.username,
				pass: this.smtpConfig.password,
			},
		});

		return this.transporter;
	}

	/**
	 * 비밀번호 재설정 이메일을 발송합니다.
	 *
	 * @param email - 수신자 이메일
	 * @param resetUrl - 비밀번호 재설정 페이지 URL (토큰 포함)
	 */
	async sendPasswordResetEmail(
		email: string,
		resetUrl: string,
	): Promise<void> {
		const subject = "비밀번호 재설정 안내";
		const html = `
			<div style="max-width: 600px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #333;">
				<h2 style="color: #0070f3;">비밀번호 재설정</h2>
				<p>비밀번호 재설정이 요청되었습니다.</p>
				<p>아래 버튼을 클릭하여 새 비밀번호를 설정하세요.</p>
				<div style="margin: 24px 0;">
					<a href="${resetUrl}"
						style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
						비밀번호 재설정하기
					</a>
				</div>
				<p style="color: #666; font-size: 14px;">
					이 링크는 30분간 유효하며, 1회만 사용할 수 있습니다.
				</p>
				<p style="color: #999; font-size: 12px;">
					본인이 요청하지 않은 경우 이 이메일을 무시하세요. 비밀번호는 변경되지 않습니다.
				</p>
			</div>
		`;

		await this.sendMail(email, subject, html);
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
		const subject = "임시 비밀번호 발급 안내";
		const html = `
			<div style="max-width: 600px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #333;">
				<h2 style="color: #0070f3;">임시 비밀번호 발급</h2>
				<p>관리자에 의해 비밀번호가 재설정되었습니다.</p>
				<div style="margin: 24px 0; padding: 16px; background-color: #f5f5f5; border-radius: 8px;">
					<p style="margin: 0; font-size: 14px; color: #666;">임시 비밀번호</p>
					<p style="margin: 8px 0 0; font-size: 20px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
						${tempPassword}
					</p>
				</div>
				<p style="color: #e53e3e; font-weight: 600;">
					로그인 후 즉시 비밀번호를 변경해주세요.
				</p>
				<p style="color: #999; font-size: 12px;">
					본인이 요청하지 않은 경우 관리자에게 문의하세요.
				</p>
			</div>
		`;

		await this.sendMail(email, subject, html);
	}

	/**
	 * 이메일 발송 공통 메서드
	 */
	private async sendMail(
		to: string,
		subject: string,
		html: string,
	): Promise<void> {
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
