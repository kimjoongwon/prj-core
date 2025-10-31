import { ValidationUtil } from "@cocrepo/schema";
import { registerAs } from "@nestjs/config";
import { IsString } from "class-validator";
import { SMTPConfig } from "./config.type";

class EnvironmentVariablesValidator {
	@IsString()
	SMTP_USERNAME!: string;

	@IsString()
	SMTP_PASSWORD!: string;

	@IsString()
	SMTP_PORT!: string;

	@IsString()
	SMTP_HOST!: string;

	@IsString()
	SMTP_SENDER!: string;
}

export default registerAs<SMTPConfig>("smtp", () => {
	ValidationUtil.validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		username: process.env.SMTP_USERNAME!,
		password: process.env.SMTP_PASSWORD!,
		port: Number(process.env.SMTP_PORT),
		host: process.env.SMTP_HOST!,
		sender: process.env.SMTP_SENDER!,
	};
});
