import { ConfigService } from "@nestjs/config";
import * as NodemailerModule from "nodemailer";
import {
	type EmailProvider,
	EmailService,
	SmtpEmailProvider,
} from "../src/email";
import { TemplateService } from "../src/template/template.service";

jest.mock("nodemailer", () => ({
	createTransport: jest.fn(),
}));

const createTransportMock =
	NodemailerModule.createTransport as unknown as jest.Mock;

describe("EmailService", () => {
	let service: EmailService;
	let mockEmailProvider: jest.Mocked<EmailProvider>;
	let mockTemplateService: jest.Mocked<TemplateService>;

	beforeEach(() => {
		mockEmailProvider = {
			send: jest.fn(),
		};

		mockTemplateService = {
			renderByCode: jest.fn(),
		} as unknown as jest.Mocked<TemplateService>;

		service = new EmailService(mockEmailProvider, mockTemplateService);
	});

	it("비밀번호 재설정 메일 발송 시 저장된 템플릿 코드를 조회하고 렌더링 결과로 전송해야 한다", async () => {
		mockTemplateService.renderByCode.mockResolvedValue({
			type: "EMAIL",
			subject: "[prj-core] 비밀번호 재설정 안내",
			content: '<a href="https://idp/reset">비밀번호 재설정하기</a>',
			unresolvedVariables: [],
		} as never);

		await service.sendPasswordResetEmail(
			"user@example.com",
			"https://idp/reset",
		);

		expect(mockTemplateService.renderByCode).toHaveBeenCalledWith(
			"AUTH_PASSWORD_RESET",
			{
				resetUrl: "https://idp/reset",
				expiresInMinutes: "30",
			},
		);
		expect(mockEmailProvider.send).toHaveBeenCalledWith({
			to: "user@example.com",
			subject: "[prj-core] 비밀번호 재설정 안내",
			html: '<a href="https://idp/reset">비밀번호 재설정하기</a>',
		});
	});

	it("임시 비밀번호 메일 발송 시 저장된 템플릿 코드를 조회하고 렌더링 결과로 전송해야 한다", async () => {
		mockTemplateService.renderByCode.mockResolvedValue({
			type: "EMAIL",
			subject: "[prj-core] 임시 비밀번호 발급 안내",
			content: "<strong>TempPass123!</strong>",
			unresolvedVariables: [],
		} as never);

		await service.sendTemporaryPasswordEmail(
			"user@example.com",
			"TempPass123!",
		);

		expect(mockTemplateService.renderByCode).toHaveBeenCalledWith(
			"AUTH_TEMPORARY_PASSWORD",
			{
				temporaryPassword: "TempPass123!",
			},
		);
		expect(mockEmailProvider.send).toHaveBeenCalledWith({
			to: "user@example.com",
			subject: "[prj-core] 임시 비밀번호 발급 안내",
			html: "<strong>TempPass123!</strong>",
		});
	});
});

describe("SmtpEmailProvider", () => {
	const sendMail = jest.fn();
	const originalEnv = process.env;

	beforeEach(() => {
		jest.clearAllMocks();
		sendMail.mockReset();
		createTransportMock.mockReturnValue({ sendMail });
		process.env = { ...originalEnv };
		delete process.env.SMTP_SECURE;
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	it("smtp 설정을 사용해 nodemailer transport를 만들고 발신자를 포함해 전송해야 한다", async () => {
		const mockConfigService = {
			get: jest.fn().mockReturnValue({
				host: "smtp.resend.com",
				port: 465,
				secure: true,
				username: "resend",
				password: "secret",
				sender: "support@onjitda.com",
			}),
		} as unknown as jest.Mocked<ConfigService>;

		const provider = new SmtpEmailProvider(mockConfigService);

		await provider.send({
			to: "user@example.com",
			subject: "테스트 제목",
			html: "<p>테스트</p>",
		});

		expect(createTransportMock).toHaveBeenCalledWith({
			host: "smtp.resend.com",
			port: 465,
			secure: true,
			auth: {
				user: "resend",
				pass: "secret",
			},
		});
		expect(sendMail).toHaveBeenCalledWith({
			from: "support@onjitda.com",
			to: "user@example.com",
			subject: "테스트 제목",
			html: "<p>테스트</p>",
		});
	});

	it("config가 없을 때 SMTP_SECURE가 비어 있으면 포트 기반 fallback 규칙을 사용해야 한다", async () => {
		process.env.SMTP_HOST = "smtp.resend.com";
		process.env.SMTP_PORT = "465";
		process.env.SMTP_SECURE = "   ";
		process.env.SMTP_USERNAME = "resend";
		process.env.SMTP_PASSWORD = "secret";
		process.env.SMTP_SENDER = "support@onjitda.com";

		const mockConfigService = {
			get: jest.fn().mockReturnValue(undefined),
		} as unknown as jest.Mocked<ConfigService>;

		const provider = new SmtpEmailProvider(mockConfigService);

		await provider.send({
			to: "user@example.com",
			subject: "테스트 제목",
			html: "<p>테스트</p>",
		});

		expect(createTransportMock).toHaveBeenCalledWith({
			host: "smtp.resend.com",
			port: 465,
			secure: true,
			auth: {
				user: "resend",
				pass: "secret",
			},
		});
	});
});
