import { LogLevel } from "@nestjs/common";
import { registerAs } from "@nestjs/config";

export interface LogConfig {
	level: LogLevel[];
	timestamp: boolean;
	colorize: boolean;
	context: boolean;
	prettyPrint: boolean;
}

const getLogConfig = (): LogConfig => {
	const isDevelopment = process.env.NODE_ENV !== "production";
	const isTest = process.env.NODE_ENV === "test";
	const isDocker = process.env.DOCKER_ENV === "true";

	if (isTest) {
		return {
			level: ["error"],
			timestamp: false,
			colorize: false,
			context: false,
			prettyPrint: false,
		};
	}

	if (isDevelopment && !isDocker) {
		// 로컬 개발 환경: pretty print 활성화
		return {
			level: ["debug", "log", "warn", "error"],
			timestamp: true,
			colorize: true,
			context: true,
			prettyPrint: true,
		};
	}

	// Production 또는 Docker 환경: JSON 구조화 로그
	return {
		level: ["log", "warn", "error"],
		timestamp: true,
		colorize: false,
		context: true,
		prettyPrint: false, // Docker에서는 pretty print 비활성화
	};
};

export const logConfig = getLogConfig();

export default registerAs<LogConfig>("log", () => getLogConfig());
