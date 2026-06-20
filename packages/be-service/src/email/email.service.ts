import { Email } from "@cocrepo/vo";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { RenderedTemplateResult } from "../template";
import { TemplateService } from "../template/template.service";
import { EmailProvider } from "./email-provider";
import type { EmailSendInput } from "./email-send-input";
import { EMAIL_TEMPLATE_CODES } from "./email-template-codes";

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
			EMAIL_TEMPLATE_CODES.PASSWORD_RESET,
			{
				resetUrl,
				expiresInMinutes: "30",
			},
		);

		await this.sendRenderedEmail(
			email,
			EMAIL_TEMPLATE_CODES.PASSWORD_RESET,
			rendered,
		);
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
			EMAIL_TEMPLATE_CODES.TEMPORARY_PASSWORD,
			{
				temporaryPassword: tempPassword,
			},
		);

		await this.sendRenderedEmail(
			email,
			EMAIL_TEMPLATE_CODES.TEMPORARY_PASSWORD,
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
			EMAIL_TEMPLATE_CODES.EMAIL_VERIFICATION,
			{
				verificationUrl,
				expiresInMinutes: "30",
			},
		);

		await this.sendRenderedEmail(
			email,
			EMAIL_TEMPLATE_CODES.EMAIL_VERIFICATION,
			rendered,
		);
	}

	/**
	 * 이메일 발송 공통 메서드
	 */
	async sendEmail(input: EmailSendInput): Promise<void> {
		let to: Email;
		try {
			to = Email.create(input.to);
		} catch {
			throw new BadRequestException("올바른 이메일 주소를 입력해주세요");
		}
		await this.emailProvider.send({
			...input,
			to: to.value,
		});
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
