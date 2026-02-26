import { ValidationUtil } from "@cocrepo/decorator";
import type { CorsConfig } from "@cocrepo/type";
import { registerAs } from "@nestjs/config";
import { IsBoolean } from "class-validator";

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
