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
		const request = ctx.getRequest<Request>();

		// 에러 타입에 따른 상태 코드 및 메시지 결정
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal server error";
		let errorData: object | null = null;
		let prismaLogData: object | undefined;

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
		} else if (exception instanceof Error) {
			message = exception.message;
		}

		// 에러 로깅
		this.logger.error({
			message,
			status,
			path: request.url,
			method: request.method,
			timestamp: new Date().toISOString(),
			...(process.env.NODE_ENV !== "production" && {
				stack: exception instanceof Error ? exception.stack : undefined,
			}),
			...(prismaLogData ? { prisma: prismaLogData } : {}),
		});

		super.catch(
			new HttpException(
				ResponseEntity.WITH_ERROR<object | string>(status, message, errorData),
				status,
			),
			host,
		);
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
