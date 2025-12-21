import { ResponseEntity } from "@cocrepo/entity";
import {
	ArgumentsHost,
	Catch,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request } from "express";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const status = exception?.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;

		// 에러 로깅
		this.logger.error({
			message: exception.message,
			status,
			path: request.url,
			method: request.method,
			timestamp: new Date().toISOString(),
			...(process.env.NODE_ENV !== "production" && {
				stack: exception.stack,
			}),
		});

		super.catch(
			new HttpException(
				ResponseEntity.WITH_ERROR<object | string>(
					status,
					exception.message,
					typeof exception?.getResponse?.() === "object"
						? exception.getResponse()
						: null,
				),
				status,
			),
			host,
		);
	}
}
