import { ValidationUtil } from "@cocrepo/decorator";
import type { SMTPConfig } from "@cocrepo/type";
import { registerAs } from "@nestjs/config";
import { IsBooleanString, IsOptional, IsString } from "class-validator";

class EnvironmentVariablesValidator {
	@IsString()
	SMTP_USERNAME!: string;

	@IsString()
	SMTP_PASSWORD!: string;

	@IsString()
	SMTP_PORT!: string;

	@IsString()
	SMTP_HOST!: string;

	@IsOptional()
	@IsBooleanString()
	SMTP_SECURE?: string;

	@IsString()
	SMTP_SENDER!: string;
}

function normalizeOptionalBooleanString(value?: string): string | undefined {
	const normalizedValue = value?.trim();
	return normalizedValue ? normalizedValue : undefined;
}

function resolveSmtpSecure(
	smtpSecure: string | undefined,
	smtpPort: string | undefined,
): boolean {
	if (smtpSecure !== undefined) {
		return smtpSecure === "true";
	}

	return Number(smtpPort) === 465;
}

export default registerAs<SMTPConfig>("smtp", () => {
	const smtpSecure = normalizeOptionalBooleanString(process.env.SMTP_SECURE);

	ValidationUtil.validateConfig(
		{
			...process.env,
			SMTP_SECURE: smtpSecure,
		},
		EnvironmentVariablesValidator,
	);

	return {
		username: process.env.SMTP_USERNAME!,
		password: process.env.SMTP_PASSWORD!,
		port: Number(process.env.SMTP_PORT),
		host: process.env.SMTP_HOST!,
		secure: resolveSmtpSecure(smtpSecure, process.env.SMTP_PORT),
		sender: process.env.SMTP_SENDER!,
	};
});
