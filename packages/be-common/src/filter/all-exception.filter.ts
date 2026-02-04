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
import { TranslationService } from "@cocrepo/be-i18n";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	constructor(private readonly translationService: TranslationService) {
		super();
	}

	async catch(exception: unknown, host: ArgumentsHost) {
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
			message = await this.getPrismaErrorMessage(exception);
			errorData = { code: exception.code, meta: exception.meta };
		} else if (exception instanceof Prisma.PrismaClientValidationError) {
			// Prisma 유효성 검사 에러
			status = HttpStatus.BAD_REQUEST;
			message = await this.translationService.translate("error.prisma.P2016");
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

	private async getPrismaErrorMessage(
		exception: Prisma.PrismaClientKnownRequestError,
	): Promise<string> {
		const key = `error.prisma.${exception.code}`;
		const translated = await this.translationService.translate(key);

		// 번역 키를 찾을 수 없는 경우 (키 자체가 반환됨)
		if (translated === key) {
			return `데이터베이스 오류 (${exception.code})`;
		}

		return translated;
	}
}
