import { ValidationUtil } from "@cocrepo/decorator";
import { registerAs } from "@nestjs/config";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { RedisConfig } from "./config.type";

class EnvironmentVariablesValidator {
	@IsString()
	@IsOptional()
	REDIS_HOST?: string;

	@IsNumber()
	@IsOptional()
	REDIS_PORT?: number;

	@IsString()
	@IsOptional()
	REDIS_PASSWORD?: string;
}

export default registerAs<RedisConfig>("redis", () => {
	ValidationUtil.validateConfig(process.env, EnvironmentVariablesValidator);

	const isDevelopment = process.env.NODE_ENV !== "production";

	return {
		host:
			process.env.REDIS_HOST ||
			(isDevelopment ? "localhost" : "redis.cocdev.co.kr"),
		port: Number(process.env.REDIS_PORT) || 6379,
		password: process.env.REDIS_PASSWORD || undefined,
	};
});
