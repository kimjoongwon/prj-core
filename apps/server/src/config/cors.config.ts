import { ValidationUtil } from "@cocrepo/decorator";
import { registerAs } from "@nestjs/config";
import { IsBoolean } from "class-validator";
import { CorsConfig } from "./config.type";

class EnvironmentVariablesValidator {
	@IsBoolean()
	CORS_ENABLED!: boolean;
}

export default registerAs<CorsConfig>("cors", () => {
	ValidationUtil.validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		enabled: process.env.CORS_ENABLED === "true",
	};
});
