import { Logger } from "@nestjs/common";

const COLORS = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	gray: "\x1b[90m",
};

const EMOJIS = {
	auth: "🔐",
	success: "✅",
	error: "❌",
	warning: "⚠️",
	info: "ℹ️",
	debug: "🐛",
	performance: "⚡",
	database: "🗄️",
	user: "👤",
	request: "📨",
	response: "📤",
	slow: "🐌",
	fast: "🚀",
	context: "📋",
	timer: "⏱️",
};

export class AppLogger extends Logger {
	private isDevelopment = process.env.NODE_ENV !== "production";

	/**
	 * 예쁜 포맷으로 개발 환경에서만 로그를 출력합니다.
	 */
	dev(
		message: unknown,
		data?: Record<string, unknown>,
		context?: string,
	): void {
		if (this.isDevelopment) {
			const emoji = EMOJIS.debug;
			const coloredMessage = `${COLORS.cyan}${emoji} ${message}${COLORS.reset}`;

			if (data) {
				const prettyData = this.prettifyData(data);
				super.debug(`${coloredMessage} ${prettyData}`, context);
			} else {
				super.debug(coloredMessage, context);
			}
		}
	}

	/**
	 * 인증 관련 예쁜 로그
	 */
	auth(
		message: string,
		data?: Record<string, unknown>,
		context?: string,
	): void {
		const emoji = EMOJIS.auth;
		const coloredMessage = `${COLORS.magenta}${emoji} ${message}${COLORS.reset}`;

		if (data) {
			const prettyData = this.prettifyData(data);
			super.log(`${coloredMessage} ${prettyData}`, context);
		} else {
			super.log(coloredMessage, context);
		}
	}

	/**
	 * 성공 로그
	 */
	success(
		message: string,
		data?: Record<string, unknown>,
		context?: string,
	): void {
		const emoji = EMOJIS.success;
		const coloredMessage = `${COLORS.green}${emoji} ${message}${COLORS.reset}`;

		if (data) {
			const prettyData = this.prettifyData(data);
			super.log(`${coloredMessage} ${prettyData}`, context);
		} else {
			super.log(coloredMessage, context);
		}
	}

	/**
	 * 예쁜 성능 측정 로그
	 */
	performance(operation: string, duration: number, context?: string): void {
		let emoji = EMOJIS.fast;
		let color = COLORS.green;
		let level: "log" | "warn" | "debug" = "debug";

		if (duration > 200) {
			emoji = EMOJIS.slow;
			color = COLORS.red;
			level = "warn";
		} else if (duration > 100) {
			emoji = EMOJIS.warning;
			color = COLORS.yellow;
			level = "warn";
		} else if (duration > 50) {
			emoji = EMOJIS.timer;
			color = COLORS.blue;
			level = "debug";
		}

		const message = `${color}${emoji} ${operation} ${COLORS.dim}(${duration}ms)${COLORS.reset}`;

		if (level === "warn" || (this.isDevelopment && level === "debug")) {
			super[level](message, context);
		}
	}

	/**
	 * 요청 관련 로그
	 */
	request(
		message: string,
		data?: Record<string, unknown>,
		context?: string,
	): void {
		const emoji = EMOJIS.request;
		const coloredMessage = `${COLORS.blue}${emoji} ${message}${COLORS.reset}`;

		if (this.isDevelopment) {
			if (data) {
				const prettyData = this.prettifyData(data);
				super.debug(`${coloredMessage} ${prettyData}`, context);
			} else {
				super.debug(coloredMessage, context);
			}
		}
	}

	/**
	 * 에러 로그 (스택 트레이스는 개발환경에서만)
	 */
	errorWithStack(message: string, error: Error, context?: string): void {
		const emoji = EMOJIS.error;
		const coloredMessage = `${COLORS.red}${emoji} ${message}${COLORS.reset}`;

		if (this.isDevelopment) {
			super.error(`${coloredMessage}: ${error.message}`, error.stack, context);
		} else {
			super.error(`${coloredMessage}: ${error.message}`, context);
		}
	}

	/**
	 * 데이터베이스 관련 로그
	 */
	database(
		message: string,
		data?: Record<string, unknown>,
		context?: string,
	): void {
		const emoji = EMOJIS.database;
		const coloredMessage = `${COLORS.cyan}${emoji} ${message}${COLORS.reset}`;

		if (data) {
			const prettyData = this.prettifyData(data);
			super.log(`${coloredMessage} ${prettyData}`, context);
		} else {
			super.log(coloredMessage, context);
		}
	}

	/**
	 * 사용자 관련 로그
	 */
	user(
		message: string,
		data?: Record<string, unknown>,
		context?: string,
	): void {
		const emoji = EMOJIS.user;
		const coloredMessage = `${COLORS.yellow}${emoji} ${message}${COLORS.reset}`;

		if (data) {
			const prettyData = this.prettifyData(data);
			this.isDevelopment
				? super.debug(`${coloredMessage} ${prettyData}`, context)
				: super.log(coloredMessage, context);
		} else {
			this.isDevelopment
				? super.debug(coloredMessage, context)
				: super.log(coloredMessage, context);
		}
	}

	/**
	 * 조건부 로그 출력
	 */
	conditional(condition: boolean, message: unknown, context?: string): void {
		if (condition) {
			super.log(message, context);
		}
	}

	/**
	 * 객체를 간소화하여 로그에 출력
	 */
	logSimple(
		message: string,
		data?: Record<string, unknown>,
		context?: string,
	): void {
		if (data) {
			const simpleData = this.simplifyObject(data);
			super.log(`${message} ${JSON.stringify(simpleData)}`, context);
		} else {
			super.log(message, context);
		}
	}

	private prettifyData(data: Record<string, unknown>): string {
		const simplified = this.simplifyObject(data);
		return `${COLORS.gray}${JSON.stringify(simplified, null, this.isDevelopment ? 2 : 0)}${COLORS.reset}`;
	}

	private simplifyObject(
		obj: Record<string, unknown>,
	): Record<string, unknown> {
		const simplified: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(obj)) {
			if (value === null || value === undefined) {
				continue;
			}

			if (typeof value === "string" && value.length > 100) {
				simplified[key] = `${value.substring(0, 50)}...`;
			} else if (Array.isArray(value)) {
				simplified[key] = `Array(${value.length})`;
			} else if (typeof value === "object") {
				simplified[key] = `Object(${Object.keys(value).length} keys)`;
			} else {
				simplified[key] = value;
			}
		}

		return simplified;
	}
}
