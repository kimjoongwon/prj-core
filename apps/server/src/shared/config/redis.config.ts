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

	const config = {
		host:
			process.env.REDIS_HOST ||
			(isDevelopment ? "localhost" : "redis.cocdev.co.kr"),
		port: Number(process.env.REDIS_PORT) || 6379,
		password: process.env.REDIS_PASSWORD || undefined,
	};

	// 설정값 로깅 (비밀번호 제외)
	console.log("[Redis Config] 로딩됨:", {
		host: config.host,
		port: config.port,
		hasPassword: !!config.password,
		NODE_ENV: process.env.NODE_ENV,
		REDIS_HOST_ENV: process.env.REDIS_HOST || "(미설정)",
	});

	return config;
});
