import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
	type INestApplication,
	Logger,
	ValidationPipe,
} from "@nestjs/common";
import type { Response } from "express";

/**
 * IdP 전용 간단한 예외 필터
 *
 * oidc-provider가 자체적으로 응답을 처리하므로,
 * 이미 응답이 전송된 경우 추가 처리를 하지 않습니다.
 */
@Catch()
class IdpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(IdpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		// oidc-provider가 이미 응답을 보낸 경우 무시
		if (response.headersSent) {
			this.logger.debug(
				"Headers already sent, skipping exception filter response",
			);
			return;
		}

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
	// IdP는 ClassSerializerInterceptor를 사용하지 않음
	// oidc-provider가 자체적으로 응답을 처리하며, NestJS 인터셉터와 충돌함
	// =================================================================
}
