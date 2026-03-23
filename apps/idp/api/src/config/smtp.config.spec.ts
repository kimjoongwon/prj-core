import smtpConfig from "./smtp.config";

type SmtpConfig = {
	secure: boolean;
};

const loadSmtpConfig = smtpConfig as unknown as () => SmtpConfig;

describe("smtpConfig", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		process.env = {
			...originalEnv,
			SMTP_USERNAME: "resend",
			SMTP_PASSWORD: "secret",
			SMTP_PORT: "587",
			SMTP_HOST: "smtp.resend.com",
			SMTP_SENDER: "support@cocdev.co.kr",
		};
		delete process.env.SMTP_SECURE;
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	it("SMTP_SECURE가 없으면 legacy fallback으로 465 포트를 secure=true로 해석해야 한다", () => {
		process.env.SMTP_PORT = "465";

		expect(loadSmtpConfig().secure).toBe(true);
	});

	it("SMTP_SECURE가 공백이면 legacy fallback으로 해석해야 한다", () => {
		process.env.SMTP_PORT = "587";
		process.env.SMTP_SECURE = "   ";

		expect(loadSmtpConfig().secure).toBe(false);
	});

	it("SMTP_SECURE가 제공되면 boolean 문자열만 허용해야 한다", () => {
		process.env.SMTP_SECURE = "yes";

		expect(() => loadSmtpConfig()).toThrow("SMTP_SECURE");
	});
});
