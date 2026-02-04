import {
	type ArgumentsHost,
	Catch,
	ClassSerializerInterceptor,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
	type INestApplication,
	Logger,
	ValidationPipe,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Response } from "express";

/**
 * IdP 전용 간단한 예외 필터
 */
@Catch()
class IdpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(IdpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal server error";

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			message = exception.message;
		} else if (exception instanceof Error) {
			message = exception.message;
			this.logger.error(`Unhandled error: ${message}`, exception.stack);
		}

		response.status(status).json({
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
		});
	}
}

export function setNestApp<T extends INestApplication>(app: T): void {
	// =================================================================
	// Global Exception Filters
	// =================================================================
	app.useGlobalFilters(new IdpExceptionFilter());

	// =================================================================
	// Global Pipes (데이터 검증 및 변환)
	// =================================================================
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: false,
		}),
	);

	// =================================================================
	// Global Interceptors
	// IdP는 JWT Guard를 전역으로 사용하지 않음 (OIDC Provider가 자체 인증 처리)
	// =================================================================
	app.useGlobalInterceptors(
		new ClassSerializerInterceptor(app.get(Reflector)),
	);
}
