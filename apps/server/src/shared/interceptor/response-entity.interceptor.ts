import { ResponseEntity } from "@cocrepo/schema";
import {
	CallHandler,
	ExecutionContext,
	HttpStatus,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RESPONSE_MESSAGE_METADATA } from "../decorator/response-message.decorator";
import { isWrappedResponse } from "../util/response.util";

@Injectable()
export class ResponseEntityInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const handler = context.getHandler();
		const classRef = context.getClass();
		const httpResponse = context.switchToHttp().getResponse();

		const defaultStatus =
			this.reflector.get<number>(HTTP_CODE_METADATA, handler) ??
			this.reflector.get<number>(HTTP_CODE_METADATA, classRef) ??
			httpResponse?.statusCode ??
			HttpStatus.OK;

		const messageFromMetadata =
			this.reflector.get<string>(RESPONSE_MESSAGE_METADATA, handler) ??
			this.reflector.get<string>(RESPONSE_MESSAGE_METADATA, classRef);

		return next.handle().pipe(
			map((value) => {
				if (value instanceof ResponseEntity) {
					return value;
				}

				let data = value;
				let meta: unknown;
				let message = messageFromMetadata;
				let status = defaultStatus;

				if (isWrappedResponse(value)) {
					data = value.data;
					meta = value.meta;
					message = value.message ?? message;
					status = value.status ?? status;
				} else if (
					value &&
					typeof value === "object" &&
					!Array.isArray(value) &&
					("data" in (value as Record<string, unknown>) ||
						"meta" in (value as Record<string, unknown>) ||
						"message" in (value as Record<string, unknown>) ||
						"status" in (value as Record<string, unknown>) ||
						"httpStatus" in (value as Record<string, unknown>))
				) {
					const record = value as Record<string, unknown>;
					if (record.data !== undefined) {
						data = record.data;
					}

					if (record.meta !== undefined) {
						meta = record.meta;
					}

					if (typeof record.message === "string") {
						message = record.message;
					}

					const explicitStatus = record.status ?? record.httpStatus;
					if (typeof explicitStatus === "number") {
						status = explicitStatus;
					}
				}

				if (!message) {
					message = status === HttpStatus.CREATED ? "생성 완료" : "성공";
				}

				return new ResponseEntity(status, message, data, meta as any);
			}),
		);
	}
}
