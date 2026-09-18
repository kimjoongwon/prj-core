import { randomUUID } from "node:crypto";
import { ResponseEntity } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { I18nTranslationService } from "@cocrepo/service";
import type { ApiDatabaseError } from "@cocrepo/type";
import {
	type ArgumentsHost,
	Catch,
	HttpException,
	type HttpServer,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import type { Request } from "express";

const INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error";
const REDACTED_VALUE = "[REDACTED]";
const SAFE_CORRELATION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
const SENSITIVE_LOG_KEY_PATTERN =
	/(authorization|cookie|password|secret|token|credential|private.?key|query)/i;

type RequestWithId = Request & {
	id?: unknown;
};

const redactSensitiveText = (value: string): string =>
	value
		.replace(
			/\b([a-z][a-z0-9+.-]*:\/\/)([^\s/@]+(?::[^\s/@]*)?@)/gi,
			`$1${REDACTED_VALUE}@`,
		)
		.replace(
			/\b(password|secret|token|authorization|credential|private[_-]?key)\s*[:=]\s*([^\s,;]+)/gi,
			`$1=${REDACTED_VALUE}`,
		)
		.replace(/(?:\/[A-Za-z0-9._-]+){2,}/g, REDACTED_VALUE)
		.replace(/[A-Za-z]:\\(?:[^\\\s]+\\)+[^\\\s]+/g, REDACTED_VALUE);

const redactInternalLogValue = (value: unknown): unknown => {
	if (typeof value === "string") {
		return redactSensitiveText(value);
	}
	if (Array.isArray(value)) {
		return value.map(redactInternalLogValue);
	}
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, nestedValue]) => [
				key,
				SENSITIVE_LOG_KEY_PATTERN.test(key)
					? REDACTED_VALUE
					: redactInternalLogValue(nestedValue),
			]),
		);
	}
	return value;
};

const PRISMA_ERROR_CONFIG = {
	P2002: {
		status: HttpStatus.CONFLICT,
		message: "중복된 데이터가 존재합니다",
	},
	P2003: {
		status: HttpStatus.BAD_REQUEST,
		message: "연관된 데이터가 존재하지 않습니다",
	},
	P2016: {
		status: HttpStatus.SERVICE_UNAVAILABLE,
		message:
			"서버 데이터베이스가 최신 상태가 아닙니다. 관리자에게 문의해 주세요.",
	},
	P2022: {
		status: HttpStatus.SERVICE_UNAVAILABLE,
		message:
			"서버 데이터베이스가 최신 상태가 아닙니다. 관리자에게 문의해 주세요.",
	},
	P2025: {
		status: HttpStatus.NOT_FOUND,
		message: "요청한 데이터를 찾을 수 없습니다",
	},
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	constructor(
		applicationRef: HttpServer,
		private readonly translationService: I18nTranslationService,
	) {
		super(applicationRef);
	}

	async catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<RequestWithId>();
		const correlationId = this.resolveCorrelationId(request.id);

		// 에러 타입에 따른 상태 코드 및 메시지 결정
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = INTERNAL_SERVER_ERROR_MESSAGE;
		let errorData: object | null = null;
		let prismaLogData: object | undefined;
		let isSafeServerError = false;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			message = exception.message;
			const response = exception.getResponse();
			errorData = typeof response === "object" ? response : null;
		} else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			const config =
				PRISMA_ERROR_CONFIG[exception.code as keyof typeof PRISMA_ERROR_CONFIG];
			status = config?.status ?? status;
			message = config?.message ?? `데이터베이스 오류 (${exception.code})`;
			errorData = this.toSafeDatabaseError(exception);
			isSafeServerError = config !== undefined;
			prismaLogData = {
				code: exception.code,
				meta: exception.meta,
				message: exception.message,
			};
		} else if (exception instanceof Prisma.PrismaClientValidationError) {
			// Prisma 유효성 검사 에러
			status = HttpStatus.BAD_REQUEST;
			message = await this.translationService.translate(
				"데이터베이스 스키마 불일치 오류",
			);
		} else if (
			exception instanceof Error &&
			"code" in exception &&
			exception.code === "LIMIT_FIELD_ARRAY_INDEX"
		) {
			status = HttpStatus.BAD_REQUEST;
			message = exception.message;
		}

		const isUnexpectedServerError =
			status >= HttpStatus.INTERNAL_SERVER_ERROR && !isSafeServerError;
		const responseMessage = isUnexpectedServerError
			? INTERNAL_SERVER_ERROR_MESSAGE
			: message;
		const responseData: object | null = isUnexpectedServerError
			? { correlationId }
			: errorData;

		// 에러 로깅
		this.logger.error({
			message: isUnexpectedServerError
				? INTERNAL_SERVER_ERROR_MESSAGE
				: redactSensitiveText(message),
			status,
			correlationId,
			path: request.url,
			method: request.method,
			timestamp: new Date().toISOString(),
			...(isUnexpectedServerError && {
				cause: this.toRedactedErrorCause(exception),
			}),
			...(process.env.NODE_ENV !== "production" && {
				stack:
					exception instanceof Error && exception.stack
						? redactSensitiveText(exception.stack)
						: undefined,
			}),
			...(prismaLogData
				? { prisma: redactInternalLogValue(prismaLogData) }
				: {}),
		});

		super.catch(
			new HttpException(
				ResponseEntity.WITH_ERROR<object | string>(
					status,
					responseMessage,
					responseData,
				),
				status,
			),
			host,
		);
	}

	private resolveCorrelationId(requestId: unknown): string {
		const requestIdValue =
			typeof requestId === "string" || typeof requestId === "number"
				? String(requestId)
				: "";

		return SAFE_CORRELATION_ID_PATTERN.test(requestIdValue)
			? requestIdValue
			: randomUUID();
	}

	private toRedactedErrorCause(exception: unknown): object {
		if (exception instanceof Error) {
			return {
				name: exception.name,
				message: redactSensitiveText(exception.message),
			};
		}

		return { value: redactInternalLogValue(exception) };
	}

	private toSafeDatabaseError(
		exception: Prisma.PrismaClientKnownRequestError,
	): ApiDatabaseError {
		const meta = exception.meta;
		const target =
			meta && typeof meta === "object" && "column" in meta
				? typeof meta.column === "string"
					? meta.column
					: undefined
				: undefined;

		return {
			code: exception.code,
			...(target ? { target } : {}),
			retryable: false,
		};
	}
}
