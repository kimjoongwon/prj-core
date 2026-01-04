import { ResponseEntity } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import {
	type ArgumentsHost,
	Catch,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import type { Request } from "express";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();

		// 에러 타입에 따른 상태 코드 및 메시지 결정
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal server error";
		let errorData: object | null = null;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			message = exception.message;
			const response = exception.getResponse();
			errorData = typeof response === "object" ? response : null;
		} else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			// Prisma 알려진 에러 처리
			message = this.getPrismaErrorMessage(exception);
			errorData = { code: exception.code, meta: exception.meta };
		} else if (exception instanceof Prisma.PrismaClientValidationError) {
			// Prisma 유효성 검사 에러
			status = HttpStatus.BAD_REQUEST;
			message = "데이터베이스 스키마 불일치 오류";
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
		});

		super.catch(
			new HttpException(
				ResponseEntity.WITH_ERROR<object | string>(status, message, errorData),
				status,
			),
			host,
		);
	}

	private getPrismaErrorMessage(
		exception: Prisma.PrismaClientKnownRequestError,
	): string {
		switch (exception.code) {
			case "P2002":
				return "중복된 데이터가 존재합니다";
			case "P2025":
				return "요청한 데이터를 찾을 수 없습니다";
			case "P2003":
				return "연관된 데이터가 존재하지 않습니다";
			case "P2016":
				return "데이터베이스 스키마 불일치 오류";
			default:
				return `데이터베이스 오류 (${exception.code})`;
		}
	}
}
