import { ValidationUtil } from "@cocrepo/decorator";
import { registerAs } from "@nestjs/config";
import { IsBoolean } from "class-validator";
import type { CorsConfig } from "@cocrepo/type";

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
